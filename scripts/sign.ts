import { generateSig } from "../src/utils/sign";

const input = {
  keyA: 'valueA',
  keyB: 'valueB',
  arrayA: ['a', 'b', {x:1,y:'m'}, [1,2,3,4,'f']],
  objectA: {nestA: 'nest value'},
  boolA: false
}

console.log(generateSig(input).);
