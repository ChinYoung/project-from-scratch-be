import {
  STRING,
  INTEGER,
  UUIDV4,
  UUID,
  DATE,
  Model,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Sequelize,
} from 'sequelize';

export enum TODO_STATE {
  CREATED = 1,
  DONE,
  EXPIRED,
}

export const STATE_MAP = {
  [TODO_STATE.CREATED]: 'CREATED',
  [TODO_STATE.DONE]: 'DONE',
  [TODO_STATE.EXPIRED]: 'EXPIRED',
};
export class TodoItem extends Model<InferAttributes<TodoItem>, InferCreationAttributes<TodoItem>> {
  declare id: CreationOptional<number>;
  declare todo_id: CreationOptional<string>;
  declare owner: string;
  declare state: CreationOptional<TODO_STATE>;
  declare content: CreationOptional<string>;
  declare start_time: CreationOptional<string>;
  declare end_time: CreationOptional<string>;
}

export function initTodoItem(sequelize: Sequelize) {
  TodoItem.init(
    {
      id: { type: INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      todo_id: { type: UUID, allowNull: false, defaultValue: UUIDV4 },
      owner: { type: new STRING(128), allowNull: false },
      content: { type: new STRING(128), allowNull: false },
      start_time: { type: DATE, allowNull: true },
      end_time: { type: DATE, allowNull: true },
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
