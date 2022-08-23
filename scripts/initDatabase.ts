import { INTEGER, STRING } from "sequelize";
import { DB } from "../src/utils/database";
import { initAccount } from "../src/model/mAccount";
import { initUser } from "../src/model/mUser";

export async function initDataBase() {
  const sequelize = new DB().current
  initAccount(sequelize)
  initUser(sequelize)
  await sequelize.sync({force: true})
  console.log('database initiated');
  process.exit()
  return sequelize
}

initDataBase()