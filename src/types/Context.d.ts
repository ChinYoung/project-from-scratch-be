import { Context } from 'koa';

export interface Ctx extends Context {
  account?: string;
}
