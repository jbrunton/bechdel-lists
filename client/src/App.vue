<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <a class="d-flex align-center" href="/">
        <v-icon large class="mr-4">mdi-filmstrip-box-multiple</v-icon>
        <v-toolbar-title class="white--text">
          Bechdel Lists
        </v-toolbar-title>
      </a>

      <v-spacer></v-spacer>

      <v-menu open-on-hover bottom offset-y v-if="signedIn">
        <template v-slot:activator="{ on }">
          <v-btn
            text
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

      <v-btn v-else text @click="signIn">
        <v-icon>mdi-account</v-icon>
        <span class="ml-2">Sign In</span>
      </v-btn>

      <v-btn
        href="https://github.com/jbrunton/bechdel-demo"
        target="_blank"
        text
      >
        <v-icon>mdi-github</v-icon>
        <span class="ml-2">Project Source</span>
      </v-btn>
    </v-app-bar>

    <v-content>
      <v-container>
        <div id="app">
          <div id="nav">
            <router-link to="/">Home</router-link> |
            <router-link to="/search">Search</router-link>
          </div>
          <router-view/>
        </div>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
/* global gapi */

const axios = require('axios');

const googleParams = {
  client_id: '952635847674-ocr6762iqhjkvtb988fclnfs4trr6qqr.apps.googleusercontent.com',
  cookie_policy: 'single_host_origin',
  scope: 'email profile',
  response_type: 'code'
};

export default {
  data() {
    return {
      signedIn: false,
      signedInUser: ""
    }
  },

  mounted() {
    gapi.load('auth2', this.checkAuthStatus);
  },

  methods : {
    async checkAuthStatus() {
      const auth = await gapi.auth2.init(googleParams);
      if (auth.isSignedIn.get()) {
        const idToken = auth.currentUser.get().getAuthResponse().id_token;
        console.log('idToken: ' + idToken);

        try {
          await axios.post('/api/auth/signin', { idToken: idToken });
          this.signedIn = true;
          this.signedInUser = auth.currentUser.get().getBasicProfile().getName()
        } catch (e) {
          alert('Unable to sign you in.');
          this.signOut();
        }
      } else {
        this.signedIn = false;
        this.signedInUser = "";
      }
    },

    signOut() {
      const auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function () {
        location.reload();
      });
    },

    async signIn() {
      const auth2 = gapi.auth2.getAuthInstance();
      const googleUser = await auth2.signIn();
      const idToken = googleUser.getAuthResponse().id_token;
      console.log('idToken: ' + idToken);

      try {
        await axios.post('/api/auth/signin', { idToken: idToken });
        this.signedIn = true;
        this.signedInUser = googleUser.getBasicProfile().getName()
      } catch (e) {
        alert('Unable to sign you in.');
        this.signOut();
      }
    }
  }
}
</script>