import koaBody from "koa-body";
import Koa, { Context, HttpError } from "koa";
import { router } from "./V1";
import { DB } from "./utils/database";
import { initDataBase } from "./model/initiate";

async function startServer() {
  const dbConnection = await initDataBase()
  const app = new Koa();
  app.use(koaBody())
  app.use(router.routes())
  app.listen(5000, () => {
    console.log('listening to 5000');
  });
  app.on('error', (err:Error) => {
    console.log(err.message);
    console.log(err.stack);
  })
}

startServer()