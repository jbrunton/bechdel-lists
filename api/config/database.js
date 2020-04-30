module.exports = {
  development: {
    // url: process.env.POSTGRES_CONNECTION,
    username: 'postgres_user',
    password: 'postgres_password',
    database: 'bechdel_demo_development',
    host: 'postgres',
    dialect: 'postgres',
    operatorsAliases: false
  },
  test: {
    username: 'postgres_user',
    password: 'postgres_password',
    database: 'bechdel_demo_test',
    host: 'postgres',
    dialect: 'postgres',
    operatorsAliases: false
  },
  production: {
    url: process.env.POSTGRES_CONNECTION
  }
};
