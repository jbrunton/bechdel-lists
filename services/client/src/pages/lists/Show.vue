<template>
  <v-container>
  <v-row justify="center">
    <v-col cols="10">

       <v-card outlined>
    <v-toolbar flat class="grey lighten-3">

      <template v-slot:extension v-if="showRatings">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-chip class="ma-2" color="white" v-on="on">
              <v-rating :dense=true :small=true :half-increments="true" :readonly="true" :hover="false"
                color="grey darken-1" background-color="grey lighten-1"
                v-model="list.averageRating" length="3"></v-rating>
              <b class="ml-2">{{avgRating}}</b>
            </v-chip>
          </template>
          <RatingToolTip :rating="list.averageRating"></RatingToolTip>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-chip class="ma-2" color="white" v-on="on">
              <span class="grey--text text--darken-1">Min</span>
              <b class="ml-2">{{minRating}}</b>
              <span class="ml-2 mr-2">-</span>
              <span class="grey--text text--darken-1">Max</span>
              <b class="ml-2">{{maxRating}}</b>
            </v-chip>
          </template>
          <RatingToolTip :rating="minRating"></RatingToolTip>
        </v-tooltip>
      </template>

      <v-toolbar-title v-text="list.title"></v-toolbar-title> 

      <v-spacer></v-spacer>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click="deleteListClicked">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
        <span>Delete List</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click="showAddMovieCardClicked">
            <v-icon>mdi-plus-circle</v-icon>
          </v-btn>
        </template>
        <span>Add Movie</span>
      </v-tooltip> 

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click="editMode = !editMode">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
        <span>Edit</span>
      </v-tooltip> 

      
      <v-progress-linear
        :active="showLoadingIndicator"
        :indeterminate="showLoadingIndicator"
        absolute
        bottom
        color="deep-purple accent-4"
      ></v-progress-linear>
    </v-toolbar>

    <v-card-text v-show="showAddMovieCard">
      <form>
        <v-text-field
          prepend-icon="mdi-magnify"
          single-line
          label="Search"
          v-model="query"
          @change="search"
        ></v-text-field>
        <v-btn class="mr-4" @click="hideAddMovieCardClicked">cancel</v-btn>
      </form>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-text>

      <div id="histogram" />
      <v-divider></v-divider>

      <v-list min-height="200" max-height="100%;">
        <v-list-item v-for="movie in movies" :key="movie.id" @click="movieClicked(movie)">
          <v-list-item-content>
            <v-list-item-title v-text="movie.title"></v-list-item-title>
            <v-list-item-subtitle v-text="movie.year"></v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-chip color="grey" v-show="!editMode" v-on="on">
                  <v-rating :dense=true :small=true :readonly=true
                    color="white" background-color="grey lighten-1"
                    v-model="movie.rating" length="3"></v-rating>
                  </v-chip>
                </template>
                <RatingToolTip :rating="movie.rating"></RatingToolTip>
              </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on" @click="removeMovie(movie)" v-show="editMode">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>Remove Movie</span>
            </v-tooltip>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>

    </v-col>
  </v-row>
  </v-container>
</template>

<style>
  .v-chip .v-avatar {
    font-weight: 500;
  }
  svg > g > g:last-child { pointer-events: none }
</style>

<script>
/* global google */

const axios = require('axios');
import RatingToolTip from '../../components/RatingToolTip';

export default {
  components: {
    RatingToolTip
  },

  data() {
    return {
      list: { title: '', movies: [] },
      movies: [],
      query: '',
      showLoadingIndicator: false,
      showAddMovieCard: false,
      showRatings: false,
      editMode: false
    }
  },

  created () {
    this.load();
  },

  methods: {
    async load() {
      this.showLoadingIndicator = true;

      //TODO: reinstate this with proper authorization
      //await Auth.authenticate();
      
      const result = await axios.get(`/api/lists/${this.$route.params.id}`);
      this.list = result.data;
      this.movies = this.list.Movies;
      this.loadCharts();
      this.updateRatings();
      this.showLoadingIndicator = false;
    },

    async deleteList() {
      this.showLoadingIndicator = true;
      await axios.delete(`/api/lists/${this.listId}`);
      this.showLoadingIndicator = true;
      this.listId = null;
    },

    async search() {
      this.movies = [];
      
      if (this.query.length >= 3) {
        this.showLoadingIndicator = true;

        const result = await axios.get(`/api/search?query=${this.query}`);
        this.movies = result.data;
        this.showLoadingIndicator = false;
      } else {
        this.showLoadingIndicator = false;
      }
    },

    async addMovie(movie) {
      this.showLoadingIndicator = true;
      this.showAddMovieCard = false;
      await axios.post(`/api/lists/${this.$route.params.id}/movies/${movie.imdbId}`);
      this.$emit('list-updated');
      this.load();
    },

    async removeMovie(movie) {
      this.showLoadingIndicator = true;
      await axios.delete(`/api/lists/${this.$route.params.id}/movies/${movie.imdbId}`);
      this.$emit('list-updated');
      this.load();
    },

    updateRatings() {
      const ratings = this.movies.map((movie) => movie.rating).filter(x => x === 0 || x);
      this.showRatings = ratings.length > 0;
      if (this.showRatings) {
        this.minRating = Math.min(...ratings);
        this.maxRating = Math.max(...ratings);
        this.avgRating = this.list.averageRating.toFixed(1);
      }
    },

    deleteListClicked() {
      this.deleteList();
    },

    showAddMovieCardClicked() {
      this.showAddMovieCard = true;
    },

    hideAddMovieCardClicked() {
      this.showAddMovieCard = false;
      this.load();
    },

    movieClicked(movie) {
      if (this.showAddMovieCard) {
        this.addMovie(movie);
      } else {
        // ???
      }
    },

    loadCharts() {
      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(this.drawCharts);
    },

    drawCharts() {
      const container = document.getElementById('histogram');
      const chart = new google.visualization.Histogram(container);
      const data = [['title', 'rating']].concat(this.movies.map(movie => [movie.title, movie.rating]));
      const options = {
        colors: ['#C62828', '#EF9A9A', '#90CAF9', '#1E88E5']
      };
      chart.draw(google.visualization.arrayToDataTable(data), options);
    }
  }
}
</script>
