import { Context, Next } from "koa";
import config from "config";
import JWT from "jsonwebtoken";

const jwtExceptions: RegExp[] = config.get('jwt-exception')
const basePath:string = config.get('base-path')
export function sign(ctx:Context, next: Next) {
  const {URL:{pathname}} = ctx
  const current = pathname.replace(basePath, '')
  if (jwtExceptions.find(patten => patten.test(current))) {
    console.log('match');
    next()
    return
  }
  const token = ctx.headers.authorization.replace('Bearer ', '')
  try {
    JWT.verify(token, 'secret')
  } catch(error) {
    console.log(error);
    
  }
}