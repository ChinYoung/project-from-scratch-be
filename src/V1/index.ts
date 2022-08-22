import { Context, Next } from "koa";
import Router from "koa-router";
import JWT from "jsonwebtoken";
import config from "config";
import { Account } from "../model/mAccount";
import { Redis } from "../utils/database";
import { User } from "../model/mUser";
import { v4 as uuidV4 } from 'uuid';
import { tUser } from "./user";
import { HttpException } from "../utils/HttpException";
import axios from "axios";

export const router = new Router({prefix: '/libra'})
router.post('/account', async (ctx:Context, next:Next) => {
  const {account, password}:{account:string, password:string} = ctx.request.body
  const count = await Account.count({
    where: {account_name: account, password}
  })
  if (!count) {
    ctx.body = {
      code: 20001,
      message: 'invalid account or password'
    }
    return
  }
  const jwtSecret:string = config.get('jwt.secret')
  const token = JWT.sign(
    {account},
    jwtSecret,
    {expiresIn: 60 * 60}
  )
  ctx.body = {
    code: 0,
    message: 'success',
    data: {token}
  }
  ctx.response.status = 200
  const redis = new Redis()
  await redis.init()
  redis.current.set(`jwt:token:${account}`, token)
  await next()
})

router.get('/user', async (ctx:Context, next:Next) => {
  const {pageSize, pageNumber} = ctx.request.query as {pageSize: string, pageNumber: string}
  const userList = await User.findAndCountAll({
    limit: Math.abs(parseInt(pageSize)),
    offset: Math.abs(parseInt(pageNumber)) * Math.abs(parseInt(pageSize))
  })
  const {count, rows} = userList
  ctx.body = {
    code: 0,
    message: 'success',
    data: {
      users: rows,
      total: count
    }
  }
  await next()
})


router.post('/user', async (ctx:Context, next: Next) => {
  const {newUser} = ctx.request.body as { newUser:tUser}
  console.log("🚀 ~ file: index.ts ~ line 63 ~ router.post ~ newUser", newUser)
  try {
    // throw new HttpException(120, 'test error')
    const newUserId = uuidV4()
    await User.create({
      ...newUser,
      user_id: newUserId
    })
    ctx.body = {
      code: 0,
      message: 'success',
      data: {
        userId: newUserId
      }
    }
  } catch(error) {
    console.table({
      error: error.constructor?.name || 'Error',
      method: 'post',
      path: '/user',
      message: error.message
    });
    throw new HttpException(10006, 'insert error')
  }
})

router.get('/oauthcb', async (ctx:Context, next:Next)) {
  const {code, state} = ctx.request.query as {code:string, state: string}
  const res = await axios.post('https://github.com/login/oauth/access_token', {
    client_id: config.get('SSO.client_id'),
    client_secret: config.get('SSO.client_secret'),
    redirect_uri: config.get('SSO.redirect_uri'),
    code
  })
  console.log("🚀 ~ file: index.ts ~ line 99 ~ router.get ~ res", res)
}

export default {
  routerV1: router
}