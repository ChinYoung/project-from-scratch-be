import { generateSig } from "../src/utils/sign";
import { tzDayjs } from "../src/utils/time";
import { v4 as UUID } from 'uuid';

export function signInput(input: Object, secret:string) {
  let params = input
  params = {
    ...input,
    timestamp: parseInt(`${tzDayjs().valueOf() * 0.001}`),
    nonce: UUID()
  }
  const sig = generateSig(params, secret)
  return {
    ...params,
    sig
  }
}
