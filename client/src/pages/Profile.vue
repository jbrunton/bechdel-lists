<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="10">

        <v-card outlined>
          <v-toolbar flat color="grey lighten-3">
            <v-toolbar-title>My Profile</v-toolbar-title>

            <v-progress-linear
              :active="loading"
              :indeterminate=true
              absolute
              bottom
              color="deep-purple accent-4"
            ></v-progress-linear>
          </v-toolbar>
          <v-card-text>

            <v-list>
              <v-subheader>Profile</v-subheader>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title v-text="name"></v-list-item-title>
                  <v-list-item-subtitle>Name</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title v-text="email"></v-list-item-title>
                  <v-list-item-subtitle>Email</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>

          </v-card-text>
        </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import { Auth } from '../auth';

export default {
  data() {
    return {
      name: '',
      email: '',
      loading: false
    };
  },

  created() {
    this.checkAuthStatus();
  },

  methods: {
    async checkAuthStatus() {
      const status = await Auth.getStatus();
      if (status.signedIn) {
        this.loadProfile();
      } else {
        window.location = '/';
      }
    },

    async loadProfile() {
      this.loading = true;

      const response = await axios.get('/api/users/me');
      const user = response.data;
      this.name = user.name;
      this.email = user.email;
      
      this.loading = false;
    }
  }
}
</script>