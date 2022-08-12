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
  jwt: {
    secret: 'jwt-secret',
    exception: [
      /^\/account$/,
    ],
  },
  redis: {
    password: 'libraredis',
  },
};
