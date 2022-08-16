import { Context, Next } from "koa";
import Router from "koa-router";
import JWT from "jsonwebtoken";
import config from "config";
import { Account } from "../model/mAccount";
import { Redis } from "../utils/database";
import { User } from "../model/mUser";

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
  ctx.body = token
  ctx.response.status = 200
  const redis = new Redis()
  await redis.init()
  redis.current.set(`jwt:token:${account}`, token)
  await next()
})

router.get('/user', async (ctx:Context, next:Next) => {
  const userList = await User.findAndCountAll({
    limit: 10,
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
  console.log("🚀 ~ file: index.ts ~ line 40 ~ router.get ~ userList", userList)
  await next()
})

export default {
  routerV1: router
}