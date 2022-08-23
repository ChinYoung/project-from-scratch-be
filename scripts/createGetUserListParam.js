import { signInput } from './sign';

const secret = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoibGlicmEiLCJpYXQiOjE2NjEyMTc3NjksImV4cCI6MTY2MTIyMTM2OX0.5DGJnD4bHWd8oIv1c0zKskJeqJFT9RhU9GWxje75mmE';

console.clear();
console.log(
  Object.entries(
    signInput({
      pageSize: 10,
      pageNumber: 0,
    }, secret),
  )
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&'),
);
