import { generateSig } from '../src/utils/sign';
import { tzDayjs } from '../src/utils/time';

const input = {
  content: 33,
  // content: `${Math.random().toString(36).slice(-8)}${Math.random().toString(36).slice(-8)}`,
  start_time: tzDayjs().format(),
  end_time: tzDayjs().format(),
  timestamp: parseInt(`${tzDayjs().valueOf() * 0.001}`),
  nonce: `${parseInt(`${Math.random() * 10000}`)}`,
};
const secret =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoibGlicmEiLCJpYXQiOjE2NjI1OTkxODcsImV4cCI6MTY2MjYwMjc4N30.9M-3AHLMPg7vT-WXvpVr1aixSHOql1zFDT1DBUFKSvM';

console.clear();
const sig = generateSig(input, secret);
console.log(
  JSON.stringify({
    ...input,
    sig,
  }),
);
