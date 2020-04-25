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
            <v-list-item-subtitle v-text="movie.year"></v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-chip color="grey">
              <v-rating dense="true" small="true" color="white" background-color="white" v-model="movie.rating" length="3"></v-rating>
            </v-chip>
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
      showLoadingIndicator: false
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
      this.showLoadingIndicator = false;
    },

    async deleteList() {
      this.showLoadingIndicator = true;
      await axios.delete(`/api/lists/${this.listId}`);
      this.showLoadingIndicator = true;
      this.listId = null;
    },

    deleteListClicked() {
      this.deleteList();
    }
  }
}
</script>
