<template>
  <v-container>
    <Breadcrumbs :params="{ list: list }" />
    <v-row justify="center">
      <v-col cols="10">
          
          <v-toolbar flat :color="editMode ? 'pink' : 'grey lighten-4'" :dark="!!editMode">
            <v-btn icon v-if="editMode" @click="editMode = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>

            <v-fade-transition mode="out-in">
              <v-toolbar-title :key="editMode">
                {{ title }}
              </v-toolbar-title>  
            </v-fade-transition>

            <template v-slot:extension v-if="showRatings || editMode">
              <v-slide-y-transition mode="out-in">
                <ListRatings v-bind:list="list" v-if="showRatings && !editMode" key='ratings' />

                <span v-if="editMode == 'delete'" key='delete'>
                  Are you sure you want to delete <b>{{ list.title }}</b>?
                </span>

                <form v-if="editMode == 'add'" key='add' style="width: 100%;">
                  <v-text-field
                    prepend-icon="mdi-magnify"
                    single-line
                    label="Search"
                    v-model="query"
                    v-debounce:200="search"
                  ></v-text-field>
                </form>

                <form v-if="editMode == 'edit'" key='edit' style="width: 100%;">
                  <v-text-field
                    single-line
                    label="Title"
                    v-model="list.title"
                  ></v-text-field>
                </form>

                <span v-if="editMode == 'privacy'" key='privacy' style="width: 100%">
                  This list is <b>{{ list.public ? 'public' : 'private' }}</b>
                </span>
              </v-slide-y-transition>
            </template>

            <v-spacer></v-spacer>

            <v-slide-x-reverse-transition>
              <v-btn text class="primary--text" v-if="!editMode && !showLoadingIndicator" :key="editMode"
                :to="{ name: 'ListCharts', params: { id: listId, parentTab: $route.params.parentTab }}"
              >
                <v-icon left color="pink">mdi-chart-timeline-variant</v-icon>View Charts
              </v-btn>
            </v-slide-x-reverse-transition>

            <v-spacer v-if="isOwner"></v-spacer>
              <v-slide-x-reverse-transition mode="in-out">
                <span v-if="editMode">
                  <IconButton v-bind:selected="editMode == 'delete'" text="Delete List" icon="mdi-delete" @click="editMode = 'delete'" />              
                  <IconButton v-bind:selected="editMode == 'add'" text="Add Movie" icon="mdi-plus-circle" @click="editMode = 'add'" />              
                  <IconButton v-bind:selected="editMode == 'privacy'" text="Edit Privacy" :icon="privacyIcon" @click="editMode = 'privacy'" />
                </span>
              </v-slide-x-reverse-transition>
              <IconButton v-if="isOwner" v-bind:selected="editMode == 'edit'" text="Edit List" icon="mdi-pencil" @click="editMode = 'edit'" />
            
            <v-progress-linear
              :active="showLoadingIndicator"
              :indeterminate="showLoadingIndicator"
              absolute
              bottom
              color="deep-purple accent-4"
            ></v-progress-linear>
          </v-toolbar>

          <v-slide-y-transition mode="out-in">
            <ListHistogram v-bind:movies="list.Movies" v-if="!editMode" key='histogram' />
          </v-slide-y-transition>

          <v-slide-y-transition mode="out-in">

            <v-row justify="center" class="mt-4" v-if="editMode == 'delete'" key='delete-form'>
              <v-btn color="red" dark @click="deleteList">Delete List</v-btn>
            </v-row>

            <v-row justify="center" class="mt-4" v-if="editMode == 'privacy'" key='privacy-form'>
              <v-btn color="red" dark @click="togglePrivacy">Make {{ list.public ? 'private' : 'public' }}</v-btn>
            </v-row>

            <v-list min-height="200" max-height="100%;" v-if="editMode != 'delete' && editMode != 'privacy'" :key="editMode">
              <v-list-item v-for="movie in movies" :key="movie.id" @click="movieClicked(movie)">
                <v-list-item-content>
                  <v-list-item-title v-text="movie.title"></v-list-item-title>
                  <v-list-item-subtitle v-text="movie.year"></v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <Rating v-bind:rating="movie.rating" v-if="editMode != 'edit'" />
                  <v-tooltip bottom v-if="editMode == 'edit'">
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
          </v-slide-y-transition>

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
      list: { title: '', public: false },
      isOwner: false,
      showLoadingIndicator: false,

      editMode: false,
      query: '',
      searchResults: [],
      
      deleteListDialog: false
    }
  },

  created () {
    this.load();
    this.authorize();
  },

  methods: {
    async load() {
      this.showLoadingIndicator = true;
      const result = await axios.get(this.listUrl);
      this.list = result.data;
      this.showLoadingIndicator = false;
    },

    async authorize() {
      this.isOwner = await Auth.isOwner('list', this.listId);
    },

    async deleteList() {
      this.deleteListDialog = false;
      this.showLoadingIndicator = true;
      await axios.delete(this.listUrl());
      this.showLoadingIndicator = false;
      this.$router.push({ name: 'MyLists' });
    },

    async search() {      
      if (this.query.length >= 3) {
        this.showLoadingIndicator = true;
        const result = await axios.get(`/api/search?query=${this.query}`);
        this.searchResults = result.data;
        this.showLoadingIndicator = false;
      } else {
        this.showLoadingIndicator = false;
      }
    },

    async addMovie(movie) {
      this.showLoadingIndicator = true;
      this.editMode = false;
      await axios.post(`${this.listUrl}/movies/${movie.imdb_id}`);
      this.load();
    },

    async removeMovie(movie) {
      this.showLoadingIndicator = true;
      await axios.delete(`${this.listUrl}/movies/${movie.imdb_id}`);
      this.$emit('list-updated');
      this.load();
    },

    showAddMovieCardClicked() {
      this.showAddMovieCard = true;
    },

    hideAddMovieCardClicked() {
      this.showAddMovieCard = false;
      this.load();
    },

    movieClicked(movie) {
      if (this.editMode == 'add') {
        this.addMovie(movie);
      } else {
        // ???
      }
    },

    togglePrivacy: async function() {
      const response = await axios.put(this.listUrl, { list: { public: !this.list.public } });
      this.list = response.data;
      this.editMode = null;
    }
  },

  computed: {
    listId: function() {
      return this.$route.params.id;
    },
    listUrl: function() {
      return `/api/lists/${this.listId}`
    },
    showRatings: function() {
      return !!this.list.average_rating;
    },
    title: function() {
      if (!this.editMode) {
        return this.list.title;
      } else if (this.editMode == 'add') {
        return 'Add a movie';
      } else if (this.editMode == 'edit') {
        return 'Edit list';
      } else if (this.editMode == 'delete') {
        return 'Delete list';
      } else if (this.editMode == 'privacy') {
        return 'Edit privacy settings'
      }
      return null;
    },
    movies: function() {
      if (this.editMode == 'add') {
        return this.searchResults;
      } else {
        return this.list.movies;
      }
    },
    privacyIcon: function() {
      return this.list.public ? 'mdi-lock-open' : 'mdi-lock'
    }
  }
}
</script>
