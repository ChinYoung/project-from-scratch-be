import { Context, Next } from "koa";
import Router from "koa-router";
import JWT from "jsonwebtoken";
import config from "config";

export const router = new Router({prefix: '/libra'})
router.post('/account', (ctx:Context, next:Next) => {
  console.log(ctx.request.body);
  console.log(ctx.request.URL);
const jwtSecret:string = config.get('jwt.secret')
const token = JWT.sign(
    {
      account: 'libra'
    },
    jwtSecret,
    {expiresIn: 60 * 60}
  )
  ctx.body = token
})

router.post('/product', (ctx:Context, next:Next) => {
  const {account} = ctx
  console.log("🚀 ~ file: index.ts ~ line 23 ~ router.post ~ account", account)
  
})

export default {
  routerV1: router
}