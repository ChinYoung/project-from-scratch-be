import { generateSig } from '../src/utils/sign';
import { tzDayjs } from '../src/utils/time';

const input = {
  pageSize: 10,
  pageNumber: 0,
  timestamp: parseInt(`${tzDayjs().valueOf() * 0.001}`),
  nonce: `${parseInt(`${Math.random() * 10000}`)}`,
};
const secret =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoibGlicmEiLCJpYXQiOjE2NjI0NTEyMTUsImV4cCI6MTY2MjQ1NDgxNX0.CQjz87DD2NWch3Xed5TNmQwgUnRSljs8S2ASVFUe4EA';

const sig = generateSig(input, secret);
console.clear();
console.log(
  `?${Object.entries(input)
    .map(([key, value]) => [key, encodeURIComponent(value)])
    .map((pair) => pair.join('='))
    .join('&')}&sig=${encodeURIComponent(sig)}`,
);
