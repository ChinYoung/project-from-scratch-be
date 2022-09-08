import { generateSig } from '../src/utils/sign';
import { tzDayjs } from '../src/utils/time';

const input = {
  content: 'xxxxx',
  // content: `${Math.random().toString(36).slice(-8)}${Math.random().toString(36).slice(-8)}`,
  start_time: tzDayjs().format(),
  end_time: tzDayjs().format(),
  timestamp: parseInt(`${tzDayjs().valueOf() * 0.001}`),
  nonce: `${parseInt(`${Math.random() * 10000}`)}`,
};
const secret =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoibGlicmEiLCJpYXQiOjE2NjI2MjQ3MDksImV4cCI6MTY2MjYyODMwOX0.PnHiXEPMp8E__PCljrRuAg4bgTKlpOt9qken5XdIUfA';

console.clear();
const sig = generateSig(input, secret);
console.log(
  JSON.stringify({
    ...input,
    sig,
  }),
);
