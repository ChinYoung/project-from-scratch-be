/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
import { v4 as UUID } from 'uuid';
import { initDataBase } from "../src/model/initiate";
import { User } from '../src/model/mUser';

export function createRandomUser() {
  const newUser = {
    user_id: UUID(),
    name: UUID(),
    gender: Math.random() * 100 > 50 ? 'male' : 'female',
    age: parseInt(`${Math.random() * 100}`, 10),
  };
  console.log('new user', JSON.stringify(newUser))
  return newUser
}
async function createAndInsertUser() {
  const conn = await initDataBase()
  await Promise.all(
    Array.from({length: 10}, (v,k) => k).map(_ => User.create(createRandomUser()))
  )
  await conn.close()
  process.exit()
}

createAndInsertUser()
