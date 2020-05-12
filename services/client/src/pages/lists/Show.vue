<template>
  <v-container>
  <v-row justify="center">
    <v-col cols="10">

       <v-card outlined>
    <v-toolbar flat class="grey lighten-3">
      <v-toolbar-title v-text="list.title"></v-toolbar-title> 

      <template v-slot:extension v-if="showRatings">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-chip class="mr-2" color="white" v-on="on" style="align: flex-end;">
              <span class="grey--text text--darken-1">Avg</span>
              <b class="ml-2 mr-2">{{avgRating}}</b>
              <v-rating :dense=true :small=true :half-increments="true" :readonly="true" :hover="false"
                color="grey darken-1" background-color="grey lighten-1"
                v-model="list.averageRating" length="3"></v-rating>
            </v-chip>
          </template>
          <RatingToolTip :rating="list.averageRating"></RatingToolTip>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-chip class="mr-2" color="white" v-on="on">
              <span class="grey--text text--darken-1">Min</span>
              <b class="ml-2">{{minRating}}</b>
            </v-chip>
          </template>
          <RatingToolTip :rating="minRating"></RatingToolTip>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-chip color="white" v-on="on">
              <span class="grey--text text--darken-1">Max</span>
              <b class="ml-2">{{maxRating}}</b>
            </v-chip>
          </template>
          <RatingToolTip :rating="maxRating"></RatingToolTip>
        </v-tooltip>

        <v-spacer></v-spacer>

        <v-btn text :to="{ name: 'ShowListCharts', params: { id: listId }}">
          <v-icon left>mdi-chart-timeline-variant</v-icon>View Charts
        </v-btn>
      </template>

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

    <ListHistogram v-bind:movies="movies" />

    <v-divider v-if="showRatings"></v-divider>

    <v-card-text>
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
</style>

<script>

const axios = require('axios');
import RatingToolTip from '../../components/RatingToolTip';
import ListHistogram from '../../components/ListHistogram';

export default {
  components: {
    RatingToolTip,
    ListHistogram
  },

  data() {
    return {
      list: { title: '', movies: [] },
      movies: [],
      query: '',
      showLoadingIndicator: false,
      showAddMovieCard: false,
      showRatings: false,
      editMode: false,
      showCharts: false,

      countByYearData: [],
      averageByYearData: [],
      countByYearOptions: {
        series: {
              0: { color: '#C62828' }, // red darken-3
              1: { color: '#EF9A9A' }, // red lighten-1
              2: { color: '#90CAF9' }, // blue lighten-3
              3: { color: '#1E88E5' }, // blue darken-1
        }
      },
      avgByYearOptions: {
        series: {
              0: { type: 'line', color: '#EC407A' }
        },
      }
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
      
      const result = await axios.get(`/api/lists/${this.listId}`);
      this.list = result.data;
      this.movies = this.list.Movies;
      this.updateRatings();
      this.loadChartData();
      this.showLoadingIndicator = false;
    },

    async loadChartData() {
      const result = await axios.get(`/api/lists/${this.listId}/charts/by_year`);
      this.countByYearData = result.data.ratingsData;
      this.averageByYearData = result.data.averageData;
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
    }
  },

  computed: {
    listId: function() {
      return this.$route.params.id;
    }
  }
}
</script>
