import { DB } from '../utils/database';
import { initAccount } from './mAccount';
import { initTodoItem } from './mTodoItem';
import { initUser } from './mUser';

export async function initDataBase() {
  const sequelize = new DB().current;
  initAccount(sequelize);
  initUser(sequelize);
  initTodoItem(sequelize);
  await sequelize.sync();
  console.log('database initiated');
  return sequelize;
}

const dbInstance = new DB().current;
export type SequelizeInstance = typeof dbInstance;
