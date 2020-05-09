function productionSslOptions() {
  const disableSsl = ['true', '1'].includes(process.env.POSTGRES_DISABLE_SSL);
  if (disableSsl) {
    if (!['test', 'development'].includes(process.env.NODE_ENV)) {
      console.warn('WARNING: Postgres SSL disabled. This should never happen in production.');
    }
    // This is necessary for testing production builds locally.
    return null;
  } else {
    return {
      require: true,
      rejectUnauthorized: false
    };
  }
}

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
      ssl: productionSslOptions()
    }
  }
};
