const { Pool } = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: 'postgres',
  databse: 'bechdel_demo',
  password: 'postgres_password'
})

module.exports = {
  init: () => {
    pool.on('error', () => console.log('Lost PG connection'));

    //pool.query('DROP TABLE IF EXISTS lists');
    pool.query('CREATE TABLE IF NOT EXISTS lists (id serial PRIMARY KEY, title TEXT)')
      .catch(err => console.log(err));
  },
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  }
}
