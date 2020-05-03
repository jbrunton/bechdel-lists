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
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }" v-if="list.averageRating != null">
                        <v-chip color="grey" v-on="on">
                          <v-rating :dense=true :small=true :half-increments=true :readonly=true
                          color="white" background-color="grey lighten-1"
                          v-model="list.averageRating" length="3"></v-rating>
                          <b class="ml-2 white--text" v-text="list.averageRating.toFixed(1)"></b>
                        </v-chip>
                      </template>
                    <RatingToolTip :rating="list.averageRating"></RatingToolTip>
                  </v-tooltip>
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
const { Auth } = require('../../auth');
import RatingToolTip from '../../components/RatingToolTip';

export default {
  components: {
    RatingToolTip
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

      await Auth.authenticate();
      
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
