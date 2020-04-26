<template>
  <v-card outlined>
    <v-toolbar flat :color="showAddListItem ? 'grey darken-3' : 'grey lighten-3'" :dark="showAddListItem">
      <v-btn
        v-if="showAddListItem"
        icon
        @click="showAddListItem = false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <v-toolbar-title>
        {{ showAddListItem ? 'New List' : 'My Lists' }}
      </v-toolbar-title>  

      <v-progress-linear
        :active="showLoadingIndicator"
        :indeterminate="showLoadingIndicator"
        absolute
        bottom
        color="deep-purple accent-4"
      ></v-progress-linear>
    </v-toolbar>

    <v-card-text v-if="showAddListItem">
      <form>
        <v-text-field
          label="Title"
          placeholder="My New List"
          v-model="newListTitle"
        ></v-text-field>
        <v-btn class="mr-4" color="success" @click="addListClicked">add</v-btn>
      </form>
    </v-card-text>

    <v-card-text v-else>
      <v-list class="mb-4 mt-2">
        <v-list-item v-for="list in lists" :key="list.id" @click="listClicked(list)">
          <v-list-item-content>
            <v-list-item-title v-text="list.title"></v-list-item-title>
            <v-list-item-subtitle v-text="list.description"></v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-chip color="grey" v-if="list.averageRating != null">
              <v-rating :dense=true :small=true :half-increments=true color="white" background-color="grey lighten-1"
                v-model="list.averageRating" length="3"></v-rating>
            </v-chip>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-fab-transition>
        <v-btn
          v-show="showActionButton"
          color="pink"
          fab
          dark
          absolute
          bottom
          right
          @click="showAddListItem = true"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-fab-transition>
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
      newListTitle: "",
      showActionButton: false
    }
  },

  created() {
    this.load();
  },

  mounted() {
    this.showActionButton = true;
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
