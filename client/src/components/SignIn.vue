<template>
  <v-menu open-on-hover bottom offset-y v-if="signedIn">
    <template v-slot:activator="{ on }">
      <v-btn
        text
        :loading="authInProgress"
        v-on="on"
      >
        {{ signedInUser }}
        <v-icon right>mdi-menu-down</v-icon>
      </v-btn>
    </template>

    <v-list>
      <v-list-item href="#">
        <v-list-item-title>Profile</v-list-item-title>
      </v-list-item>
      <v-list-item @click="signOut">
        <v-list-item-title>Sign out</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>

  <v-btn v-else text @click="signIn" :loading="authInProgress">
    <v-icon>mdi-account</v-icon>
    <span class="ml-2">Sign In</span>
  </v-btn>
</template>

<script>
/* global gapi */

const axios = require('axios');

const googleParams = {
  client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID,
  cookie_policy: 'single_host_origin',
  scope: 'email profile',
  response_type: 'code'
};

export default {
  data() {
    return {
      signedIn: false,
      signedInUser: "",
      authInProgress: false
    }
  },

  mounted() {
    gapi.load('auth2', this.checkAuthStatus);
  },

  methods : {
    async checkAuthStatus() {
      this.authInProgress = true;
      const auth = await gapi.auth2.init(googleParams);
      if (auth.isSignedIn.get()) {
        const googleUser = auth.currentUser.get();
        await this.verifyUser(googleUser);
      } else {
        this.signedIn = false;
        this.signedInUser = "";
        this.authInProgress = false;
      }
    },

    signOut() {
      this.authInProgress = true;
      const auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function () {
        location.reload();
      });
    },

    async signIn() {
      this.authInProgress = true;
      const auth2 = gapi.auth2.getAuthInstance();
      const googleUser = await auth2.signIn();
      await this.verifyUser(googleUser);
    },

    async verifyUser(googleUser) {
      try {
        const idToken = googleUser.getAuthResponse().id_token;
        await axios.post('/api/auth/signin', { idToken: idToken });
        this.signedIn = true;
        this.signedInUser = googleUser.getBasicProfile().getName();
        this.authInProgress = false;
      } catch (e) {
        alert('Unable to sign you in.');
        this.signOut();
      }
    }
  }
}
</script>
