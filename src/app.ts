import koaBody from "koa-body";
import Koa, { Context, HttpError } from "koa";
import { router } from "./V1";
import { DB, Redis } from "./utils/database";
import { initDataBase } from "./model/initiate";
import { sign } from "./middleware/sign";
import config from "config";

const app = new Koa();
app.use(koaBody())
app.use(sign)
app.use(router.routes())

const port = config.get('port')
app.listen(port,
  async () => {
    const dbConnection = await initDataBase()
    console.log(`listening to ${port}`);
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