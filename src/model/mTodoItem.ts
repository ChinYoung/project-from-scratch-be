import { Model, CreationOptional, InferAttributes, InferCreationAttributes, INTEGER, STRING } from 'sequelize';
import { SequelizeInstance } from './initiate';

enum STATE {
  CREATED = 1,
  DONE,
  EXPIRED,
}
export class TodoItem extends Model<InferAttributes<TodoItem>, InferCreationAttributes<TodoItem>> {
  declare id: CreationOptional<number>;
  declare todo_id: CreationOptional<string>;
  declare owner: string;
  declare state: STATE;
  declare content: string;
  declare start_time: CreationOptional<string>;
  declare end_time: CreationOptional<string>;
}

export function initTodoItem(sequelize: SequelizeInstance) {
  TodoItem.init(
    {
      id: { type: INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      todo_id: { type: new STRING(40), allowNull: false },
      owner: { type: new STRING(128), allowNull: false },
      content: { type: new STRING(128), allowNull: false },
      start_time: { type: new STRING(32), allowNull: true },
      end_time: { type: new STRING(32), allowNull: true },
      state: { type: INTEGER.UNSIGNED, allowNull: false },
    },
    {
      tableName: 'TodoItem',
      paranoid: true,
      sequelize,
      indexes: [{ unique: true, fields: ['owner', 'todo_id'] }],
    },
  );
}
