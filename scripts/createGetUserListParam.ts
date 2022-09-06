import { signInput } from './sign';

const secret =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoibGlicmEiLCJpYXQiOjE2NjI0NDUzMzksImV4cCI6MTY2MjQ0ODkzOX0.7cc0Qaop8nnUIDNEMt_e2vbFu7dHMb0owPknvkMd_sk';

console.clear();
console.log(
  Object.entries(
    signInput(
      {
        pageSize: 10,
        pageNumber: 0,
      },
      secret,
    ),
  )
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&'),
);
