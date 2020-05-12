<template>
 <v-container>
    <v-row justify="center">
      <v-col cols="10">
       <v-card outlined>
        <v-toolbar flat color="grey lighten-3">                
          <v-fade-transition mode="out-in">
            <v-toolbar-title>
                  Browse
            </v-toolbar-title>  
          </v-fade-transition>                

          <v-progress-linear
            :active="showLoadingIndicator"
            :indeterminate="showLoadingIndicator"
            absolute
            bottom
            color="deep-purple accent-4"
          ></v-progress-linear>
        </v-toolbar>

        <v-slide-y-transition mode="out-in">           
            <v-card-text>
              <v-list class="mb-4 mt-2">
                <v-list-item v-for="list in lists" :key="list.id" @click="listClicked(list)">
                  <v-list-item-content>
                    <v-list-item-title v-text="list.title"></v-list-item-title>
                    <v-list-item-subtitle v-text="list.description"></v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <Rating v-bind:rating="list.averageRating" :showScore="true" />
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card-text>
        </v-slide-y-transition>
      </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const axios = require('axios');
import Rating from '../../components/Rating';

export default {
  components: {
    Rating
  },

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
      
      const result = await axios.get('/api/lists/browse');
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
      this.$router.push({ name: 'ShowList', params: { id: list.id }})
    }
  }
}
</script>
