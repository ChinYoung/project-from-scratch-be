import { CreationOptional, InferAttributes, InferCreationAttributes, Model, INTEGER, STRING } from "sequelize";

export class Account extends Model<InferAttributes<Account>, InferCreationAttributes<Account>> {
  declare id: CreationOptional<number>;
  declare account_id: CreationOptional<string>;
  declare account_name: string;
  declare password: string;
}

export function initAccount(sequelize) {
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
      indexes: [
        {unique: true, fields: ['account_id']},
        {unique: true, fields: ['account_name']}
      ]
    }
  )
}
