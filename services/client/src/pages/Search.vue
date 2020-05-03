<template>
  <v-container>
    <h1>Search</h1>

    <v-row>

      <v-col cols="6">

        <v-toolbar>

          <v-text-field
            hide-details
            single-line
            v-model="query"
            @change="search"
            prepend-icon="mdi-magnify">
          </v-text-field>

          <v-progress-linear
            :active="showLoadingIndicator"
            :indeterminate="showLoadingIndicator"
            absolute
            bottom
            color="deep-purple accent-4"
          ></v-progress-linear>

        </v-toolbar>
    
        <v-list two-line subheader class="mt-2" min-height="200">
          <v-list-item v-for="movie in movies" :key="movie.id" @click="movieSelected">
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

      </v-col>

    </v-row>
  </v-container>
</template>

<script>
const axios = require('axios');

export default {
  data() {
    return {
      movies: [],
      showLoadingIndicator: false,
      query: ""
    }
  },

  methods: {
    async search() {
      this.movies = [];
      
      if (this.query.length >= 3) {
        this.showLoadingIndicator = true;

        const result = await axios.get(`/api/search?query=${this.query}`);
        const movies = result.data.map(movie => Object.assign({
          starRating: this.starRating(movie)
        }, movie));
        this.movies = movies;

        this.showLoadingIndicator = false;
      } else {
        this.showLoadingIndicator = false;
      }
    },

    starRating(movie) {
      const rating = Array(3).fill({ icon: 'mdi-star-outline' })
      rating.fill({ icon: 'mdi-star' }, 0, movie.rating);
      return rating;
    },

    movieSelected() {

    }
  }
}
</script>
