import { Next } from 'koa';
import Router from 'koa-router';
import JWT from 'jsonwebtoken';
import config from 'config';
import { Account } from '../model/mAccount';
import { Redis } from '../utils/database';
import { User } from '../model/mUser';
import { v4 as uuidV4 } from 'uuid';
import { tUser } from '../types/user';
import { HttpException } from '../utils/HttpException';
import axios from 'axios';
import { STATE_MAP, TodoItem, TODO_STATE } from '../model/mTodoItem';
import { Ctx } from '../types/Context';

export const router = new Router({ prefix: '/libra' });
router.post('/account', async (ctx: Ctx, next: Next) => {
  const { account, password }: { account: string; password: string } = ctx.request.body;
  const count = await Account.count({
    where: { account_name: account, password },
  });
  if (!count) {
    ctx.body = {
      code: 20001,
      message: 'invalid account or password',
    };
    return;
  }
  const jwtSecret: string = config.get('jwt.secret');
  const token = JWT.sign({ account }, jwtSecret, { expiresIn: 60 * 60 });
  ctx.body = {
    code: 0,
    message: 'success',
    data: { token },
  };
  ctx.response.status = 200;
  const redis = new Redis();
  await redis.init();
  redis.current.set(`jwt:token:${account}`, token);
  await next();
});

router.get('/user', async (ctx: Ctx, next: Next) => {
  const { pageSize, pageNumber } = ctx.request.query as { pageSize: string; pageNumber: string };
  const userList = await User.findAndCountAll({
    limit: Math.abs(parseInt(pageSize)),
    offset: Math.abs(parseInt(pageNumber)) * Math.abs(parseInt(pageSize)),
  });
  const { count, rows } = userList;
  ctx.body = {
    code: 0,
    message: 'success',
    data: {
      users: rows,
      total: count,
    },
  };
  await next();
});

router.post('/user', async (ctx: Ctx, next: Next) => {
  const { newUser } = ctx.request.body as { newUser: tUser };
  console.log('🚀 ~ file: index.ts ~ line 63 ~ router.post ~ newUser', newUser);
  try {
    // throw new HttpException(120, 'test error')
    const newUserId = uuidV4();
    await User.create({
      ...newUser,
      user_id: newUserId,
    });
    ctx.body = {
      code: 0,
      message: 'success',
      data: {
        userId: newUserId,
      },
    };
  } catch (error) {
    console.table({
      error: error.constructor?.name || 'Error',
      method: 'post',
      path: '/user',
      message: error.message,
    });
    throw new HttpException(10006, 'insert error');
  }
});

router.get('/oauthcb', async (ctx: Ctx, next: Next) => {
  const { code, state } = ctx.request.query as { code: string; state: string };
  const res = await axios.post(
    'https://github.com/login/oauth/access_token',
    {
      client_id: config.get('SSO.client_id'),
      client_secret: config.get('SSO.client_secret'),
      redirect_uri: config.get('SSO.redirect_uri'),
      code,
    },
    {
      headers: {
        Accept: 'application/json',
      },
    },
  );
  const { access_token, token_type } = res.data as { access_token: string; token_type: string };
  const userInfoRes = await axios.get('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  const {
    data: userinfo,
    data: { id, login, avatar_url },
  } = userInfoRes as { data: { id: number; login: string; avatar_url: string } };
  console.log('🚀 ~ file: index.ts ~ line 110 ~ router.get ~ userinfo', userinfo);
  const redis = new Redis();
  await redis.init();
  redis.current.set(`${id}:access_token`, access_token, { EX: 60 * 60 });
  redis.current.set(`${id}:user_info`, JSON.stringify(userinfo), { EX: 60 * 60 });
  const account = await Account.findOne({
    where: { github_id: id } as { github_id: number },
  });
  if (!account) {
    ctx.body = {
      code: 20001,
      message: 'invalid account or password',
    };
    return;
  }
  const { account_id, account_name, avatar, id: localId } = account;
  console.log('🚀 ~ file: index.ts ~ line 127 ~ router.get ~ account_id', account_id);
  console.log('🚀 ~ file: index.ts ~ line 127 ~ router.get ~ account_name', account_name);
  console.log('🚀 ~ file: index.ts ~ line 127 ~ router.get ~ avatar', avatar);
  if (!(account_name.trim() && account_id.trim() && avatar.trim())) {
    account.account_id = uuidV4();
    account.account_name = login;
    account.avatar = avatar_url;
    await account.save();
  }
  const jwtSecret: string = config.get('jwt.secret');
  const userData = { id: account.account_id, name: account.account_name, avatar: account.avatar };
  const token = JWT.sign(userData, jwtSecret, { expiresIn: 60 * 60 });
  redis.current.set(`jwt:token:${id}`, token);
  ctx.redirect(`${config.get('front-end-host')}${config.get('base-path')}/?token=${token}`);
  await next();
});

// 查询列表
router.get('/todo', async (ctx: Ctx, next: Next) => {
  const { account } = ctx;
  const { pageSize, pageNumber } = ctx.request.query as { pageSize: string; pageNumber: string };
  const todoItemRes = await TodoItem.findAndCountAll({
    limit: Math.abs(parseInt(pageSize)),
    offset: Math.abs(parseInt(pageNumber)) * Math.abs(parseInt(pageSize)),
    where: {
      owner: account,
    },
    order: ['id'],
  });
  const { count, rows } = todoItemRes;
  ctx.body = {
    code: 0,
    message: 'success',
    data: {
      todoItems: rows,
      total: count,
    },
  };
  await next();
});
// 根据 id 查询详情
router.get('/todo/:id', async (ctx: Ctx, next: Next) => {
  const { account } = ctx;
  const { id } = ctx.params as { id: number };
  const res: TodoItem = await TodoItem.findOne({ where: { todo_id: id, owner: account } });
  const { content, end_time, start_time, state, todo_id } = res;
  ctx.body = {
    code: 0,
    message: 'success',
    data: {
      content,
      end_time,
      start_time,
      state: STATE_MAP[state],
      id: todo_id,
    },
  };
  await next();
});
// 新增
router.post('/todo', async (ctx: Ctx, next: Next) => {
  const { account } = ctx;
  const { content, start_time, end_time } = ctx.request.body as TodoItem;
  try {
    await TodoItem.create({
      content,
      start_time,
      end_time,
      owner: account,
      state: TODO_STATE.CREATED,
    });
    ctx.body = {
      code: 0,
      message: 'success',
    };
    await next();
  } catch (error) {
    console.table({
      error: error.constructor?.name || 'Error',
      method: 'post',
      path: '/todo',
      message: error.message,
    });
    throw new HttpException(10010, 'insert error');
  }
});

// 删除
router.delete('/todo/:id', async (ctx: Ctx, next: Next) => {});

export default {
  routerV1: router,
};
