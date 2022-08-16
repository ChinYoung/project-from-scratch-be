import { generateSig } from "../src/utils/sign";
import { tzDayjs } from "../src/utils/time";

const input = {
  // "account": "libra",
  // "password": "xxxxx",
  timestamp: parseInt(`${tzDayjs().valueOf() * 0.001}`),
  nonce: parseInt(`${Math.random() * 10000}`)
}
const secret = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoibGlicmEiLCJpYXQiOjE2NjA2MzI1NDMsImV4cCI6MTY2MDYzNjE0M30.qpNVTp7qwMspQ9G7v_UJySmRqqjwbJ5pubfbXLDXIw0'
const sig = generateSig(input, secret)
console.log(`?timestamp=${input.timestamp}&nonce=${input.nonce}&sig=${sig}`);
