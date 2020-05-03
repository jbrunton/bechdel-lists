module.exports = {
  development: {
    url: process.env.POSTGRES_CONNECTION,
    username: 'postgres_user',
    password: 'postgres_password',
    database: 'bechdel_lists_development',
    host: 'postgres',
    dialect: 'postgres',
    operatorsAliases: false
  },
  test: {
    url: process.env.POSTGRES_CONNECTION,
    username: 'postgres_user',
    password: 'postgres_password',
    database: 'bechdel_lists_test',
    host: 'postgres',
    dialect: 'postgres',
    operatorsAliases: false
  },
  production: {
    url: process.env.POSTGRES_CONNECTION,
    operatorsAliases: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
