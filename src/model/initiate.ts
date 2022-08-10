import { INTEGER, STRING } from "sequelize";
import { DB } from "../utils/database";
import { Account } from "./mAccount";

export async function initDataBase() {
  const sequelize = new DB().current
  Account.init(
    {
      account_id: {type: new STRING(32), allowNull: false},
      account_name: {type: new STRING(128), allowNull: false},
      id: {type: INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true},
      password:{type: new STRING(32), allowNull: false}
    },
    {
      tableName: 'Account',
      paranoid: true,
      sequelize,
    }
  )
  await sequelize.sync()
  console.log('database initiated');
  return sequelize
  
}