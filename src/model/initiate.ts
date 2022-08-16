import { INTEGER, STRING } from "sequelize";
import { DB } from "../utils/database";
import { initAccount } from "./mAccount";
import { initUser } from "./mUser";

export async function initDataBase() {
  const sequelize = new DB().current
  initAccount(sequelize)
  initUser(sequelize)
  await sequelize.sync()
  console.log('database initiated');
  return sequelize
}