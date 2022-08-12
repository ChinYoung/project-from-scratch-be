import koaBody from "koa-body";
import Koa, { Context, HttpError } from "koa";
import { router } from "./V1";
import { DB, Redis } from "./utils/database";
import { initDataBase } from "./model/initiate";
import { sign } from "./middleware/sign";

const app = new Koa();
app.use(koaBody())
app.use(sign)
app.use(router.routes())
app.listen(5000,
  async () => {
    const dbConnection = await initDataBase()
    console.log('listening to 5000');
  },
);
app.on('error', (err:Error, ctx:Context) => {
  console.log(err.message);
  console.log(err.stack);
  ctx.body = {
    code: 99999,
    message: 'unknown error'
  }
})