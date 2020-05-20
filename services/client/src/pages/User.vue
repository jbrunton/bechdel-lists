<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="10">

        <v-toolbar flat color="grey lighten-4">
          <v-toolbar-title>Lists by {{ user.name }}</v-toolbar-title>
        </v-toolbar>

        <ListIndex v-bind:lists="lists" parentTab="browse" />

      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
#user_name >>> .v-input__icon--append .v-icon { 
    color: #8BC34A;
}
</style>

<script>
import axios from 'axios';
import ListIndex from '@/components/ListIndex';

export default {
  components: {
    ListIndex
  },
  data() {
    return {
      user: {},
      lists: []
    };
  },

  created() {
    this.loadUser();
  },

  methods: {
    async loadUser() {
      this.user = (await axios.get(`/api/users/${this.userId}`)).data;
      this.lists = (await axios.get(`/api/users/${this.userId}/lists`)).data
    }
  },

  computed: {
    userId() {
      return this.$route.params.userId;
    },
    parentTab() {
      return `users/${this.userId}`;
    }
  }
}
</script>
