/* eslint-disable no-console */
import { v4 as UUID } from 'uuid';
import { initDataBase } from '../src/model/initiate';
import { TodoItem, TODO_STATE } from '../src/model/mTodoItem';

export function createRandomItem() {
  const newItem = {
    todo_id: UUID(),
    owner: UUID(),
    content: UUID(),
    start_time: '2022-09-06 00:00:00',
    end_time: '2022-09-16 00:00:00',
    state: TODO_STATE.CREATED,
  };
  console.log('new user', JSON.stringify(newItem));
  return newItem;
}
async function createAndInsertTodoItem() {
  const conn = await initDataBase();
  await Promise.all(Array.from({ length: 10 }, (v, k) => k).map(() => TodoItem.create(createRandomItem())));
  await conn.close();
  process.exit();
}

createAndInsertTodoItem();
