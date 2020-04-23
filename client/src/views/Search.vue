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
          <v-btn icon>
            <v-icon color="grey lighten-1">mdi-information</v-icon>
          </v-btn>
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
      this.movies = result.data;
    }
  }
}
</script>
