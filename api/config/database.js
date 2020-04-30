module.exports = {
  development: {
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
    connectionString: process.env.POSTGRES_CONNECTION
  }
};
