<template>
  <v-menu open-on-hover bottom offset-y v-if="signedIn">
    <template v-slot:activator="{ on }">
      <v-btn
        text
        :loading="loading"
        v-on="on"
        data-cy="nav-user-menu"
      >
        {{ signedInUser }}
        <v-icon right>mdi-menu-down</v-icon>
      </v-btn>
    </template>

    <v-list data-cy="nav-user-menu-options">
      <v-list-item :to="{ name: 'Profile' }" data-cy="nav-profile">
        <v-list-item-title>Profile</v-list-item-title>
      </v-list-item>
      <v-list-item @click="signOut" data-cy="nav-sign-out">
        <v-list-item-title>Sign Out</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>

  <v-btn v-else text @click="signIn" :loading="loading">
    <v-icon>mdi-account</v-icon>
    <span class="ml-2">Sign In</span>
  </v-btn>
</template>

<script>
import { Auth } from '../auth';

export default {
  data() {
    const { assumeSignedIn, assumedUserName } = Auth.getAssumedStatus();
    return {
      signedIn: assumeSignedIn,
      signedInUser: assumedUserName,
      loading: false,
      assumeSignedIn: assumeSignedIn
    }
  },

  mounted() {
    this.checkAuthStatus();
  },

  methods : {
    async checkAuthStatus() {
      const status = await Auth.getStatus();
      if (status.signedIn) {
        this.signedIn = true;
        this.signedInUser = status.user.name;
      }
    },

    async signOut() {
      this.loading = true;
      Auth.signOut();
    },

    async signIn() {
      this.loading = true;
      Auth.signIn();
    }
  }
}
</script>

