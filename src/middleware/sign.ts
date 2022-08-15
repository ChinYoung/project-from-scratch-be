import { Context, Next } from "koa";
import config from "config";
import JWT from "jsonwebtoken";
import {TokenExpiredError} from "jsonwebtoken";
import { Redis } from "../utils/database";
import { generateSig } from "../utils/sign";
import { tzDayjs } from "../utils/time";
import { HttpException } from "../utils/HttpException";

const jwtExceptions: RegExp[] = config.get('jwt.exception')
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
    const token = ctx.headers.authorization.replace('Bearer ', '')
    // 签名校验
    const requestParams: inputSigParams = ctx.request.body || ctx.request.query
    await verifySig(requestParams, token)
    // exceptions
    if (jwtExceptions.find(patten => patten.test(current))) {
      console.log('match');
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
    if (error instanceof HttpException) {
      const httpError = error as HttpException
      ctx.body = {
        code: httpError.code,
        message: httpError.message
      }
      return
    }
    ctx.body = {
      code: 10001,
      message: 'invalid request'
    }
  }
}


async function verifySig(input: inputSigParams, secret: string) {
  const testNonce = `${parseInt(`${Math.random() * 100000}`)}`
  const {sig: inputSig = '', timestamp = parseInt(`${tzDayjs().valueOf() * 0.001}`), nonce = testNonce} = input
  console.log("🚀 ~ file: sign.ts ~ line 75 ~ verifySig ~ inputSig", inputSig)
  console.log("🚀 ~ file: sign.ts ~ line 75 ~ verifySig ~ nonce", nonce)
  console.log("🚀 ~ file: sign.ts ~ line 75 ~ verifySig ~ timestamp", timestamp)
  const nonceTimeOut = config.get('nonce.timeout')
  // 超时
  const redis = new Redis()
  await redis.init()
  const now = tzDayjs().valueOf() * 0.001
  if (now - timestamp > nonceTimeOut) {
    throw new HttpException(10004, 'invalid request')
  }
  const nonceKey = `${timestamp}:${nonce}`
  const nonceCache = await redis.current.get(nonceKey)
  // 重放
  if (nonceCache) {
    throw new HttpException(10005, 'invalid request')
  }
  redis.current.set(nonceKey, nonce, {EX: parseInt(nonceTimeOut)})
  const sig = generateSig(input, secret)
  console.log("🚀 ~ file: sign.ts ~ line 93 ~ verifySig ~ sig", sig)
  // 签名校验不通过
  if (inputSig !== sig) {
    throw new HttpException(10003, 'invalid request')
  }
}