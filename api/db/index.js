const Sequelize = require('sequelize');

// Option 1: Passing parameters separately
const sequelize = new Sequelize('bechdel_demo', 'postgres', 'postgres_password', {
  host: 'postgres',
  dialect: 'postgres',
  define: {
    timestamps: true,
    underscored: true
  }
});

const List = sequelize.define('list', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  averageRating: Sequelize.FLOAT
});

List.prototype.updateRating = async function() {
  const movies = await this.getMovies();
  const ratings = movies.map((movie) => movie.rating).filter(x => x);
  if (ratings.length > 0) {
    this.averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  } else {
    this.averageRating = null;
  }
  await this.save();
};

const Movie = sequelize.define('movie', {
  title: Sequelize.STRING,
  imdbId: {
    type: Sequelize.STRING,
    unique: true
  },
  year: Sequelize.INTEGER,
  rating: Sequelize.INTEGER
});

Movie.belongsToMany(List, {through: 'ListEntry'});
List.belongsToMany(Movie, {through: 'ListEntry'});

module.exports = {
  List: List,
  Movie: Movie,
  init: async () => {
    try {
      await sequelize.authenticate()
      console.log('Connection has been established successfully.');
    } catch (err) {
      console.error('Unable to connect to the database:', err);
    }
    
    // await sequelize.sync({ force: true });
    await sequelize.sync();
  },
  isValidationError: (error) => error instanceof Sequelize.ValidationError
}