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
      <v-list-item @click="myListsClicked">
        <v-list-item-title>My Lists</v-list-item-title>
      </v-list-item>
      <v-list-item @click="profileClicked">
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
import { Auth } from '../auth';

export default {
  data() {
    return {
      signedIn: false,
      signedInUser: "",
      authInProgress: false
    }
  },

  mounted() {
    this.checkAuthStatus();
  },

  methods : {
    async checkAuthStatus() {
      this.authInProgress = true;

      const status = await Auth.getStatus();
      if (status.signedIn) {
        this.signedIn = true;
        this.signedInUser = status.user.name;
      }

      this.authInProgress = false;
    },

    async signOut() {
      this.authInProgress = true;
      Auth.signOut();
    },

    async signIn() {
      this.authInProgress = true;
      Auth.signIn();
    },

    profileClicked() {
      this.$router.push({ name: 'Profile' })
    },

    myListsClicked() {
      this.$router.push({ name: 'MyLists' })
    }
  }
}
</script>

