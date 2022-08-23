import { CreationOptional, InferAttributes, InferCreationAttributes, Model, INTEGER, STRING } from "sequelize";
import { v4 as uuidV4 } from 'uuid';
export class Account extends Model<InferAttributes<Account>, InferCreationAttributes<Account>> {
  declare id: CreationOptional<number>;
  declare account_id: CreationOptional<string>;
  declare account_name: string;
  declare password: string;
  declare github_id: CreationOptional<number>;
  declare avatar: CreationOptional<string>
}

export function initAccount(sequelize) {
  Account.init(
    {
      account_id: {type: new STRING(128), allowNull: false, defaultValue: () => uuidV4() },
      account_name: {type: new STRING(128), allowNull: false},
      id: {type: INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true},
      password:{type: new STRING(128), allowNull: true},
      github_id: {type: INTEGER.UNSIGNED, allowNull: true, defaultValue: null},
      avatar: {type: STRING, allowNull: true}
    },
    {
      tableName: 'Account',
      paranoid: true,
      sequelize,
      indexes: [
        {unique: true, fields: ['account_id']},
        {unique: true, fields: ['github_id']}
      ]
    }
  )
}
