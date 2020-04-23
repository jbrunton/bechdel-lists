<template>
  <div class="search">
    <h1>Search</h1>

    <ul>
      <li v-for="movie in movies" :key="movie.id">
        {{ movie.title }}
      </li>
    </ul>
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
