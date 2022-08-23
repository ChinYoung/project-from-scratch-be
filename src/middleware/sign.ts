import { Context, Next } from "koa";
import config from "config";
import JWT from "jsonwebtoken";
import {TokenExpiredError} from "jsonwebtoken";
import { Redis } from "../utils/database";
import { generateSig } from "../utils/sign";
import { tzDayjs } from "../utils/time";
import { HttpException } from "../utils/HttpException";

const jwtExceptions: RegExp[] = config.get('jwt.exception')
const signExceptions: RegExp[] = config.get('sign.exception')
const jwtSecret:string = config.get('jwt.secret')
const basePath:string = config.get('base-path')

type inputSigParams  = {
  nonce: string,
  timestamp: number,
  sig: string
}

export async function sign(ctx:Context, next: Next) {
  const {URL:{pathname}} = ctx
  const current = pathname.replace(basePath, '')
  const redis = new Redis()
  await redis.init()
  try {
    // exceptions
    if (signExceptions.find(patten => patten.test(current))) {
      console.log('match signExceptions');
      await next()
      return
    }
    let token = ctx.headers?.authorization?.replace('Bearer', '').trim()
    token = token ? token : 'Bearer'
    // 签名校验
    const requestParams: inputSigParams = ctx.request.method.toLowerCase() === 'post' ? ctx.request.body : ctx.request.query
    console.log("🚀 ~ file: sign.ts ~ line 37 ~ sign ~ ctx.request.query", ctx.request.query)
    console.log("🚀 ~ file: sign.ts ~ line 37 ~ sign ~ ctx.request.body", ctx.request.body)
    await verifySig(requestParams, token)
    // exceptions
    if (jwtExceptions.find(patten => patten.test(current))) {
      console.log('match jwtExceptions');
      await next()
      return
    }
    // token 校验
    // 校验 token 有效性
    const payload: {account:string} = JWT.verify(token, jwtSecret)
    const {account} = payload
    // 校验是否是签发中 token
    const cachedToken = await redis.current.get(`jwt:token:${account}`)
    if (cachedToken !== token) {
      throw new HttpException(10007, 'invalid request')
    }
    ctx.account = account
    await next()
  } catch(error) {
    console.log("🚀 ~ file: sign.ts ~ line 49 ~ sign ~ error", error)
    if (error instanceof TokenExpiredError) {
      ctx.response.status = 403
      ctx.body = {
        code: 10002,
        message: 'token expired'
      }
      return
    }
    if (error instanceof HttpException) {
      ctx.response.status = 200
      const httpError = error as HttpException
      ctx.body = {
        code: httpError.code,
        message: httpError.message
      }
      return
    }
    throw error
    // ctx.body = {
    //   code: 10001,
    //   message: 'invalid request'
    // }
  }
}


async function verifySig(input: inputSigParams, secret: string) {
  console.log('signing ================================================')
  console.log("🚀 ~ file: sign.ts ~ line 86 ~ verifySig ~ input", input)
  console.log("🚀 ~ file: sign.ts ~ line 108 ~ verifySig ~ secret", secret)
  const {sig: inputSig, timestamp, nonce} = input
  const nonceTimeOut = config.get('nonce.timeout')
  // 超时
  // FIXME: recover me
  // const redis = new Redis()
  // await redis.init()
  // const now = tzDayjs().valueOf() * 0.001
  // if (now - timestamp > nonceTimeOut) {
  //   throw new HttpException(10004, 'invalid request')
  // }
  // 重放
  // FIXME: recover me
  // const nonceKey = `${timestamp}:${nonce}`
  // const nonceCache = await redis.current.get(nonceKey)
  // if (nonceCache) {
  //   throw new HttpException(10005, 'invalid request')
  // }
  // redis.current.set(nonceKey, nonce, {EX: parseInt(nonceTimeOut)})
  const sig = generateSig(input, secret)
  console.log("🚀 ~ file: sign.ts ~ line 110 ~ verifySig ~ sig", sig)
  // 签名校验不通过
  if (inputSig !== sig) {
    throw new HttpException(10003, 'invalid request')
  }
}