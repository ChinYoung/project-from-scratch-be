import { generateSig } from "../src/utils/sign";
import { tzDayjs } from "../src/utils/time";

const input = {
  // "account": "libra",
  // "password": "xxxxx",
  timestamp: parseInt(`${tzDayjs().valueOf() * 0.001}`),
  nonce: `${parseInt(`${Math.random() * 10000}`)}`
}
const secret = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoibGlicmEiLCJpYXQiOjE2NjA2MzQ5MjgsImV4cCI6MTY2MDYzODUyOH0.pQDYUT8ho4fyKvS9u2HCatKemr05YDDym_u_j5QKLCA'
const sig = generateSig(input, secret)
console.log(`?timestamp=${input.timestamp}&nonce=${input.nonce}&sig=${encodeURIComponent(sig)}`);
