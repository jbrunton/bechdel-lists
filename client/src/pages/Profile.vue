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
    this.load();
  },

  methods: {
    async load() {
      this.loading = true;

      try {
        const user = await Auth.authenticate();
        this.name = user.name;
        this.email = user.email;
      } catch {
        window.location = '/';
      }
      
      this.loading = false;
    }
  }
}
</script>