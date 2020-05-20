<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="10">

        <v-toolbar flat color="grey lighten-4">
          <v-toolbar-title>My Profile</v-toolbar-title>
        </v-toolbar>

        <v-list>
          <v-list-item id="user_name">
            <v-list-item-content>
              <v-text-field
                v-model="user.name"
                label="User Name"
                :error="updateStatus.error"
                :error-messages="updateStatus.errorMessages"
                required
                @change="updateUser"
                :append-icon="updateStatus.icon"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-text-field
                v-model="user.email"
                label="Sign-In Email"
                disabled
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>
        </v-list>

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
import { Auth } from '@/auth';
import axios from 'axios';

export default {
  data() {
    return {
      user: {},
      updateStatus: {
        error: false,
        icons: null,
        errorMessages: null
      }
    };
  },

  created() {
    this.loadUser();
  },

  methods: {
    async loadUser() {
      const { user } = await Auth.getStatus();
      this.user = user;
    },

    async updateUser() {
      try {
        const response = await axios.put('/api/users/profile', { user: { name: this.user.name } });
        this.user = response.data;
        this.updateStatus = {
          error: false,
          icon: 'mdi-check',
          errorMessages: null
        }
      } catch (e) {
        this.updateStatus = {
          error: true,
          icon: 'mdi-alert'
        }
        console.log(e.response?.data);
        if (e.response?.data?.errors?.name) {
          this.updateStatus.errorMessages = e.response.data.errors.name;
        }
      }
    }
  }
}
</script>
