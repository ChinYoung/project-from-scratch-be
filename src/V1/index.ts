import { Context, Next } from "koa";
import Router from "koa-router";

export const router = new Router({prefix: '/libra'})
router.post('/account', (ctx:Context, next:Next) => {
  console.log(ctx.request.body);
  console.log(ctx.request.URL);
  ctx.body = 'hello account'
})

export default {
  routerV1: router
}