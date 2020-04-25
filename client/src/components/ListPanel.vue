<template>
  <v-card outlined>
    <v-toolbar flat class="grey lighten-3">
      <v-toolbar-title v-text="list.title"></v-toolbar-title>  

      <v-progress-linear
        :active="showLoadingIndicator"
        :indeterminate="showLoadingIndicator"
        absolute
        bottom
        color="deep-purple accent-4"
      ></v-progress-linear>
    </v-toolbar>

    <v-card-text>

      <v-list min-height="200" max-height="100%;">
        <v-list-item v-for="movie in list.movies" :key="movie.id">
          <v-list-item-content>
            <v-list-item-title v-text="movie.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
const axios = require('axios');

export default {
  data() {
    return {
      list: { title: '', movies: [] },
      showLoadingIndicator: false
    }
  },

  created() {
    this.load();
  },

  methods: {
    async load() {
      this.showLoadingIndicator = true;

      const result = await axios.get('/api/lists/1');
      this.list = result.data;
      this.showLoadingIndicator = false;
    },
  }
}
</script>
