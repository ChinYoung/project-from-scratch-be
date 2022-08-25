import { signInput } from './sign';

console.clear();
console.log(JSON.stringify(
  signInput({
    account: 'libra',
    password: 'xxxxx',
  }, 'Bearer'),
));
