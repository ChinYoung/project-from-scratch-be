const Koa = require('koa');

const app = new Koa();

app.use(async (ctx) => {
  console.log('🚀 ~ file: app.js ~ line 6 ~ app.use ~ ctx', ctx.request.URL);
  ctx.body = 'hello world';
});

app.listen(5000, () => {
  console.log('listening to 5000');
});
