<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="10">
        <v-card outlined>

          <v-toolbar flat class="grey lighten-3">
            <v-toolbar-title v-text="list.title"></v-toolbar-title> 

            <template v-slot:extension v-if="showRatings">
              <ListRatings v-bind:list="list" />
            </template>

            <v-spacer></v-spacer>

            <v-btn text class="primary--text" :href="listUrl">
              <v-icon left color="pink">mdi-view-list</v-icon>View List
            </v-btn>

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

          <div id="charts-area">
            <v-row>
              <v-col cols="6">
                <Chart title="Ratings Count By Year"
                  :data="countByYearData"
                  :chart-options="countByYearOptions"></Chart>
              </v-col>
              <v-col cols="6">
                <Chart title="Ratings Percent By Year"
                  :data="countByYearData"
                  stacked-percentage
                  :chart-options="countByYearOptions"></Chart>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <Chart title="Average Rating By Year"
                  :data="averageByYearData"
                  :chart-options="avgByYearOptions"
                  :percentage-height="0.3"></Chart>
              </v-col>
            </v-row>
          </div>

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
import ListRatings from '../../components/ListRatings';
import Chart from '../../components/Chart';
import ListHistogram from '../../components/ListHistogram';

export default {
  components: {
    ListRatings,
    Chart,
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

      countByYearData: null,
      averageByYearData: null,
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
      
      const result = await axios.get(`/api/lists/${this.listId}`);
      this.list = result.data;
      this.movies = this.list.Movies;
      this.updateRatings();
      await this.loadChartData();
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
    },
    listUrl: function() {
      return this.$router.resolve({ name: 'List', params: { id: this.listId, parentTab: this.$route.params.parentTab }}).href;
    }
  }
}
</script>
