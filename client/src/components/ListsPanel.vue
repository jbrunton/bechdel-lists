<template>
  <v-card outlined>
    <v-toolbar flat class="grey lighten-3">
      <v-toolbar-title>My Lists</v-toolbar-title>  
      
      <v-spacer></v-spacer>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click="showAddListItemClicked">
            <v-icon>mdi-plus-circle</v-icon>
          </v-btn>
        </template>
        <span>Add List</span>
      </v-tooltip>

      <v-progress-linear
        :active="showLoadingIndicator"
        :indeterminate="showLoadingIndicator"
        absolute
        bottom
        color="deep-purple accent-4"
      ></v-progress-linear>
    </v-toolbar>

    <v-card-text v-show="showAddListItem">
      <form>
        <v-text-field
          label="Title"
          placeholder="My New List"
          v-model="newListTitle"
        ></v-text-field>
        <v-btn class="mr-4" color="success" @click="addListClicked">add</v-btn>
        <v-btn @click="hideAddListItemClicked">cancel</v-btn>
      </form>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-text>
      <v-list min-height="200" max-height="100%;">
        <v-list-item v-for="list in lists" :key="list.id" @click="listClicked(list)">
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
      showLoadingIndicator: false,
      showAddListItem: false,
      newListTitle: ""
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
    },

    showAddListItemClicked() {
      this.showAddListItem = true;
    },

    hideAddListItemClicked() {
      this.showAddListItem = false;
    },

    listClicked(list) {
      this.$emit('list-selected', list);
    },

    async addListClicked() {
      try {
        this.showLoadingIndicator = true;
        await axios.post('/api/lists', { title: this.newListTitle });
        this.showAddListItem = false;
        this.load();
      } catch (e) {
        alert(e);
      }
    }
  }
}
</script>
