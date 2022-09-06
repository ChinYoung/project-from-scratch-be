module.exports = {
  'database-config': {
    host: 'localhost',
    port: 3306,
    username: 'libra',
    password: 'libra',
    dialect: 'mysql',
    database: 'libra',
  },
  'front-end-host': 'https://www.rakki.fun:30689',
  'base-path': '/libra',
  port: 5000,
  sign: {
    secret: 'secret',
    exception: [/^\/oauthcb$/],
  },
  jwt: {
    secret: 'jwt-secret',
    exception: [/^\/account$/],
  },
  redis: {
    password: 'libraredis',
  },
  nonce: {
    timeout: 1500,
  },
  SSO: {
    client_id: 'ad1304e89d9bb4b22337',
    client_secret: '89b6ce72365c4c342c30ee1484f701682c742e9a',
    redirect_uri: 'https://www.rakki.fun:30789/libra/oauthcb',
  },
};
