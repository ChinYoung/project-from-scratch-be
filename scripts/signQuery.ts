import { generateSig } from "../src/utils/sign";
import { tzDayjs } from "../src/utils/time";

const input = {
  // "account": "libra",
  // "password": "xxxxx",
  timestamp: `${parseInt(`${tzDayjs().valueOf() * 0.001}`)}`,
  nonce: `${parseInt(`${Math.random() * 10000}`)}`
}
const secret = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoibGlicmEiLCJpYXQiOjE2NjA2Mjk2NTIsImV4cCI6MTY2MDYzMzI1Mn0.Fm8OBltmjSoFVMLo_og6stLsZLITpabyTOXX5u5krBI'
const sig = generateSig(input, secret)
console.log(`?timestamp=${input.timestamp}&nonce=${input.nonce}&sig=${sig}`);
