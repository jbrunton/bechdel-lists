<template>
  <v-container>
    <Breadcrumbs :params="{ list: list }" />
    <v-row justify="center">
      <v-col cols="10">
          <v-toolbar flat class="grey lighten-4">
            <v-toolbar-title v-text="list.title"></v-toolbar-title> 

            <template v-slot:extension v-if="showRatings">
              <ListRatings v-bind:list="list" />
              <v-spacer></v-spacer>
              <v-select
                v-model="selectedGenre"
                :items="genres"
                :item-text="function (item) { return `${item.name} (${item.count})` }"
                :item-value="function (item) { return item.id }"
                label="Filter"
              ></v-select>
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

          <ListHistogram v-bind:movies="list.movies" />

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
      list: {},
      genres: [],
      selectedGenre: null,
      showLoadingIndicator: false,
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
      await this.loadChartData();
      await this.loadGenres();
      this.showLoadingIndicator = false;
    },

    async loadChartData() {
      const result = await axios.get(`/api/lists/${this.listId}/charts/by_year`);
      this.countByYearData = result.data.ratingsData;
      this.averageByYearData = result.data.averageData;
    },

    async loadGenres() {
      const result = await axios.get(`/api/lists/${this.listId}/genres`);
      this.genres = [{ name: 'All', id: null, count: this.list.movies.length }].concat(result.data);
    }
  },

  watch: {
    selectedGenre: async function(genreId) {
      this.showLoadingIndicator = true;
      const query = genreId ? `?genre_id=${genreId}` : '';
      const url = `/api/lists/${this.listId}${query}`;
      const result = await axios.get(url);
      this.list = result.data;
      
      const chartsResult = await axios.get(`/api/lists/${this.listId}/charts/by_year${query}`);
      this.countByYearData = chartsResult.data.ratingsData;
      this.averageByYearData = chartsResult.data.averageData;
      
      // await this.loadChartData();
      // await this.loadGenres();
      //this.list = result.data;
      this.showLoadingIndicator = false;
    }
  },

  computed: {
    listId: function() {
      return this.$route.params.id;
    },
    listUrl: function() {
      return this.$router.resolve({ name: 'List', params: { id: this.listId, parentTab: this.$route.params.parentTab }}).href;
    },
    showRatings: function() {
      return !!this.list.average_rating;
    }
  }
}
</script>
