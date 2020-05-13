<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="10">
        <v-card outlined>

          <v-toolbar flat class="grey lighten-3">
            <v-toolbar-title v-text="list.title"></v-toolbar-title> 

            <template v-slot:extension v-if="showRatings">
              <ListRatings v-bind:list="list" />

              <v-spacer></v-spacer>

              <IconButton v-if="isOwner" text="Delete List" icon="mdi-delete" @click="deleteListClicked" />              
              <IconButton v-if="isOwner" text="Add Movie" icon="mdi-plus-circle" @click="showAddMovieCardClicked" />              
              <IconButton v-if="isOwner" text="Edit List" icon="mdi-pencil" @click="editMode = !editMode" />
            </template>

            <v-spacer></v-spacer>

            <v-btn text class="primary--text" :to="{ name: 'ListCharts', params: { id: listId, parentTab: $route.params.parentTab }}">
              <v-icon left color="pink">mdi-chart-timeline-variant</v-icon>View Charts
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

          <v-card-text>
            <v-list min-height="200" max-height="100%;">
              <v-list-item v-for="movie in movies" :key="movie.id" @click="movieClicked(movie)">
                <v-list-item-content>
                  <v-list-item-title v-text="movie.title"></v-list-item-title>
                  <v-list-item-subtitle v-text="movie.year"></v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <Rating v-bind:rating="movie.rating" v-if="!editMode" />
                  <v-tooltip bottom v-if="editMode">
                    <template v-slot:activator="{ on }">
                      <v-btn icon v-on="on" @click="removeMovie(movie)">
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
import ListRatings from '../../components/ListRatings';
import ListHistogram from '../../components/ListHistogram';
import IconButton from '@/components/toolbar/IconButton';
import Rating from '@/components/Rating';
import { Auth } from '@/auth';

export default {
  components: {
    ListRatings,
    ListHistogram,
    Rating,
    IconButton
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
      isOwner: false
    }
  },

  created () {
    this.load();
    this.authorize();
  },

  methods: {
    async load() {
      this.showLoadingIndicator = true;
      const result = await axios.get(`/api/lists/${this.listId}`);
      this.list = result.data;
      this.showRatings = this.list.averageRating != null;
      this.movies = this.list.Movies;
      this.showLoadingIndicator = false;
    },

    async authorize() {
      this.isOwner = await Auth.isOwner('list', this.listId);
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
