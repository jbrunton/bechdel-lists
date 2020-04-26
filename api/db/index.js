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
  averageRating: Sequelize.FLOAT,
  description: Sequelize.STRING
});

List.prototype.updateDetails = async function() {
  const movies = await this.getMovies();
  
  const ratings = movies.map((movie) => movie.rating).filter(x => x);
  if (ratings.length > 0) {
    this.averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  } else {
    this.averageRating = null;
  }

  if (movies.length == 0) {
    this.description = null;
  } else if (movies.length == 1) {
    this.description = movies[0].title;
  } else if (movies.length == 2) {
    this.description = `${movies[0].title} and ${movies[1].title}`;
  } else {
    const remainder = movies.length - 2;
    const remainderDescription = remainder > 1 ? 'others' : 'other';
    this.description = `${movies[0].title}, ${movies[1].title} and ${remainder} ${remainderDescription}`;
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
    
    //await sequelize.sync({ force: true });
    await sequelize.sync();
  },
  isValidationError: (error) => error instanceof Sequelize.ValidationError
}
