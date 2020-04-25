<template>
  <v-card outlined>
    <v-toolbar flat class="grey lighten-3">
      <v-toolbar-title>My Lists</v-toolbar-title>  
      
      <v-spacer></v-spacer>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-plus-circle</v-icon>
          </v-btn>
        </template>
        <span>Add List</span>
      </v-tooltip>
    </v-toolbar>

    <v-card-text>

      <v-list min-height="200" max-height="100%;">
        <v-list-item v-for="list in lists" :key="list.id">
          <v-list-item-content>
            <v-list-item-title v-text="list.title"></v-list-item-title>
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
      lists: [],
      showLoadingIndicator: false
    }
  },

  created() {
    this.load();
  },

  methods: {
    async load() {
      this.lists = [];
      this.showLoadingIndicator = true;

      const result = await axios.get('/api/lists');
      this.lists = result.data;
      this.showLoadingIndicator = false;
    }
  }
}
</script>
