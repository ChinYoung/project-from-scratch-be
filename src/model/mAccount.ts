import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";

export class Account extends Model<InferAttributes<Account>, InferCreationAttributes<Account>> {
  declare id: CreationOptional<number>;
  declare account_id: CreationOptional<string>;
  declare account_name: string;
  declare password: string;
}