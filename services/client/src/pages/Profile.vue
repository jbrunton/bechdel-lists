<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="10">

        <v-toolbar flat color="grey lighten-4">
          <v-toolbar-title>My Profile</v-toolbar-title>
        </v-toolbar>

        <v-list>
          <v-subheader>Profile</v-subheader>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>Name</v-list-item-subtitle>
              <v-list-item-title v-text="user.name"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>Email</v-list-item-subtitle>
              <v-list-item-title v-text="user.email"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { Auth } from '@/auth';

export default {
  data() {
    return {
      user: {}
    };
  },

  created() {
    this.loadUser();
  },

  methods: {
    async loadUser() {
      const { user } = await Auth.getStatus();
      this.user = user;
    }
  }
}
</script>
