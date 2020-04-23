<template>
  <div class="search" width="50%">
    <h1>Search</h1>

    <v-list two-line subheader>
      <v-list-item v-for="movie in movies" :key="movie.id">
        <v-list-item-content>
          <v-list-item-title v-text="movie.title"></v-list-item-title>
          <v-list-item-subtitle v-text="movie.year"></v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-chip color="grey">
            <v-icon small color="white" v-for="star in movie.starRating" :key="star.index">
              {{ star.icon }}
            </v-icon>
          </v-chip>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
const axios = require('axios');

export default {
  data() {
    return {
      movies: []
    }
  },

  created() {
    this.load();
  },

  methods: {
    async load() {
      const result = await axios.get('/api/search?query=matrix');
      const movies = result.data.map(movie => Object.assign({
        starRating: this.starRating(movie)
      }, movie));
      this.movies = movies;
    },

    starRating(movie) {
      const rating = Array(3).fill({ icon: 'mdi-star-outline' })
      rating.fill({ icon: 'mdi-star' }, 0, movie.rating);
      return rating;
    }
  }
}
</script>
