'use strict';
module.exports = (sequelize, DataTypes) => {

  const List = sequelize.define('List', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description: DataTypes.STRING,
    averageRating: DataTypes.FLOAT,
    minRating: DataTypes.INTEGER,
    maxRating: DataTypes.INTEGER
  }, {});

  List.associate = function(models) {
    List.belongsToMany(models.Movie, {through: 'ListEntry'});
    List.belongsTo(models.User);
  };

  List.statsFor = function(movies) {
    const ratings = movies.map((movie) => movie.rating).filter(x => x === 0 || x);
    if (ratings.length > 0) {
      return {
        averageRating: ratings.reduce((a, b) => a + b, 0) / ratings.length,
        minRating: Math.min(...ratings),
        maxRating: Math.max(...ratings)
      };
    } else {
      return {
        averageRating: null,
        minRating: null,
        maxRating: null
      };
    }
  }

  List.prototype.updateDetails = async function() {
    const movies = await this.getMovies();
    
    const stats = List.statsFor(movies);
    this.averageRating = stats.averageRating;
    this.minRating = stats.minRating;
    this.maxRating = stats.maxRating;
  
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

  return List;
};