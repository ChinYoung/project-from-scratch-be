import { CreationOptional, InferAttributes, InferCreationAttributes, INTEGER, JSON, Model, NUMBER, STRING } from "sequelize";

type Address = {
  province: string;
  city: string;
  district: string;
  detailAddress: string;
}

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare user_id: string;
  declare name: CreationOptional<string>;
  declare gender: CreationOptional<string>;
  declare age: CreationOptional<number>;
  declare avatar: CreationOptional<string>;
  declare cellphone: CreationOptional<string>;
  declare address: CreationOptional<Address>

}

export function initUser (sequelize) {
  User.init(
    {
      id: {type: INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true},
      user_id: {type: new STRING(36), allowNull: false},
      name: {type: new STRING(128), allowNull: false},
      gender: {type: STRING, allowNull: false},
      age: {type: INTEGER.UNSIGNED, allowNull: false},
      avatar: {type: STRING, allowNull: true},
      cellphone: {type: STRING, allowNull: true},
      address: {type: JSON, allowNull: true}
    },
    {
      tableName: 'User',
      paranoid: true,
      sequelize,
      indexes: [
        {unique: true, fields: ['user_id']},
      ]
    }
  )
}