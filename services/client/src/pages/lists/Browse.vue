<template>
 <v-container>
    <v-row justify="center">
      <v-col cols="10">
        <v-toolbar flat color="grey lighten-4">                
          <v-toolbar-title>Browse</v-toolbar-title>  

          <v-progress-linear
            :active="showLoadingIndicator"
            :indeterminate="showLoadingIndicator"
            absolute
            bottom
            color="deep-purple accent-4"
          ></v-progress-linear>
        </v-toolbar>

        <ListIndex v-bind:lists="lists" parentTab="browse" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const axios = require('axios');
import ListIndex from '@/components/ListIndex';

export default {
  components: {
    ListIndex
  },

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
      
      const result = await axios.get('/api-rails/lists/browse');
      this.lists = result.data;
      this.showLoadingIndicator = false;
    }
  }
}
</script>
