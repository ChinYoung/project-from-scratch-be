import { Context, Next } from "koa";
import config from "config";
import JWT from "jsonwebtoken";
import {TokenExpiredError} from "jsonwebtoken";
import { Redis } from "../utils/database";

const jwtExceptions: RegExp[] = config.get('jwt.exception')
const jwtSecret:string = config.get('jwt.secret')
const basePath:string = config.get('base-path')
export async function sign(ctx:Context, next: Next) {
  const {URL:{pathname}} = ctx
  const current = pathname.replace(basePath, '')
  if (jwtExceptions.find(patten => patten.test(current))) {
    console.log('match');
    await next()
    return
  }
  const token = ctx.headers.authorization.replace('Bearer ', '')
  try {
    const payload: {account:string} = JWT.verify(token, jwtSecret)
    const {account} = payload
    const redis = new Redis()
    await redis.init()
    const cachedToken = await redis.current.get(`jwt:token:${account}`)
    if (cachedToken !== token) {
      throw new Error('fake token')
    }
    ctx.account = account
    await next()
  } catch(error) {
    ctx.response.status = 403
    if (error instanceof TokenExpiredError) {
      ctx.body = {
        code: 10002,
        message: 'token expired'
      }
      return
    }
    ctx.body = {
      code: 10001,
      message: 'token invalid'
    }
  }
}