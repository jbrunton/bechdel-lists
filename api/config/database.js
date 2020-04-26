module.exports = {
  development: {
    username: 'postgres',
    password: 'postgres_password',
    database: 'bechdel_demo_development',
    host: process.env.POSTGRES_HOST || '127.0.0.1',
    dialect: 'postgres',
    operatorsAliases: false
  },
  test: {
    username: 'postgres',
    password: 'postgres_password',
    database: 'bechdel_demo_test',
    host: process.env.POSTGRES_HOST || '127.0.0.1',
    dialect: 'postgres',
    operatorsAliases: false
  },
  production: {
    username: 'postgres',
    password: process.env.POSTGRESS_PASSWORD,
    database: 'bechdel_demo',
    host: 'postgres',
    dialect: 'postgres',
    operatorsAliases: false
  }
};
