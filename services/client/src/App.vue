<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-container style="display: flex;">
        <router-link to="/" class="d-flex align-center">
          <v-icon large class="mr-4">mdi-filmstrip-box-multiple</v-icon>
          <v-toolbar-title class="white--text">
            Bechdel Lists
          </v-toolbar-title>
        </router-link>

        <v-spacer></v-spacer>

        <SignIn />

        <v-btn
          href="https://github.com/jbrunton/bechdel-lists"
          target="_blank"
          text
        >
          <v-icon>mdi-github</v-icon>
          <span class="ml-2">Source</span>
        </v-btn>
      </v-container>
      <template v-slot:extension>
        <v-container>
          <v-btn id="nav-browse" depressed tile color="primary" class="mr-1" :to="{ name: 'BrowseLists' }">Browse</v-btn>
          <v-btn id="nav-my-lists" depressed tile color="primary" :to="{ name: 'MyLists' }" v-if="signedIn">My Lists</v-btn>
        </v-container>
      </template>
    </v-app-bar>

    <v-content>
      <v-container>
        <div id="app">
          <router-view/>
        </div>
      </v-container>
    </v-content>

    <v-footer absolute app>
      <v-row justify="center" no-gutters>
        <span class="ma-2">
          Bechdel Lists v{{ buildVersion }}
        </span>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import SignIn from './components/SignIn';
import { Auth } from './auth';

export default {
  components: {
    SignIn
  },

  data() {
    return {
      signedIn: false,
      buildVersion: process.env.VUE_APP_BUILD_VERSION
    };
  },

  created() {
    this.checkAuthStatus();
  },

  methods: {
    async checkAuthStatus() {
      const status = await Auth.getStatus();
      this.signedIn = status.signedIn;
    }
  }
}
</script>
