<template>
  <v-card outlined v-show="showPanel">
    <v-toolbar flat class="grey lighten-3">
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
      <v-list min-height="200" max-height="100%;">
        <v-list-item v-for="movie in movies" :key="movie.id" @click="movieClicked(movie)">
          <v-list-item-content>
            <v-list-item-title v-text="movie.title"></v-list-item-title>
            <v-list-item-subtitle v-text="movie.year"></v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-chip color="grey" v-show="!editMode">
              <v-rating :dense=true :small=true color="white" background-color="white" v-model="movie.rating" length="3"></v-rating>
            </v-chip>

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
</template>

<script>
const axios = require('axios');

export default {
  props: {
    listId: Number
  },

  data() {
    return {
      list: { title: '', movies: [] },
      movies: [],
      query: '',
      showLoadingIndicator: false,
      showAddMovieCard: false,
      editMode: false
    }
  },

  watch: {
    listId () {
      this.load();
    }
  },

  computed: {
    showPanel () {
      return this.listId != undefined && this.listId != null && this.listId != '';
    }
  },

  methods: {
    async load() {
      this.showLoadingIndicator = true;

      const result = await axios.get(`/api/lists/${this.listId}`);
      this.list = result.data;
      this.movies = this.list.movies;
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
      await axios.post(`/api/lists/${this.listId}/movies/${movie.imdbId}`);
      this.$emit('list-updated');
      this.load();
    },

    async removeMovie(movie) {
      this.showLoadingIndicator = true;
      await axios.delete(`/api/lists/${this.listId}/movies/${movie.imdbId}`);
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
  }
}
</script>
