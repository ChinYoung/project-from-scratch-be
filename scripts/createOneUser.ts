/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
import { v4 as UUID } from 'uuid';
import { signInput } from './sign';

const secret = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoibGlicmEiLCJpYXQiOjE2NjA4ODcxODcsImV4cCI6MTY2MDg5MDc4N30.WrnKCsywqKy6Kjhp0ukRLuG55e8pdQCrFHWjSVVrfWg';

export function createRandomUser() {
  const newUser = {
    name: UUID(),
    gender: Math.random() * 100 > 50 ? 'male' : 'female',
    age: parseInt(`${Math.random() * 100}`, 10),
  };
  return signInput({ newUser }, secret);
}

console.clear();
console.log(JSON.stringify(
  createRandomUser(),
));
