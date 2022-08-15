module.exports = {
  'database-config': {
    host: 'localhost',
    port: 3306,
    username: 'libra',
    password: 'libra',
    dialect: 'mysql',
    database: 'libra',
  },
  'base-path': '/libra',
  port: 5009,
  sign: {
    secret: 'secret',
  },
  jwt: {
    secret: 'jwt-secret',
    exception: [
      /^\/account$/,
    ],
  },
  redis: {
    password: 'libraredis',
  },
  nonce: {
    timeout: 15,
  },
};
