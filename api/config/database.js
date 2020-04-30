module.exports = {
  development: {
    username: 'postgres',
    password: 'postgres_password',
    database: 'bechdel_demo_development',
    host: 'postgres',
    dialect: 'postgres',
    operatorsAliases: false
  },
  test: {
    username: 'postgres',
    password: 'postgres_password',
    database: 'bechdel_demo_test',
    host: 'postgres',
    dialect: 'postgres',
    operatorsAliases: false
  },
  production: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: 'bechdel_demo',
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    dialect: 'postgres',
    operatorsAliases: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
