import { generateSig } from "../src/utils/sign";
import { tzDayjs } from "../src/utils/time";

const input = {
  "account": "libra",
  "password": "xxxxx",
  timestamp: parseInt(`${tzDayjs().valueOf() * 0.001}`),
  nonce: `${parseInt(`${Math.random() * 10000}`)}`
}
const secret = 'Bearer'
const sig = generateSig(input, secret)
console.log(JSON.stringify({
  ...input,
  sig
}));
