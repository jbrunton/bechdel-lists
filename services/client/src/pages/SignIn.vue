<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="10">
        <v-banner single-line>
          <v-avatar slot="icon" color="primary" size="40">
            <v-icon icon="mdi-lock" color="white">mdi-lock</v-icon>
          </v-avatar>
          {{ message }}
        </v-banner>
        <div class="text-center ma-8">
        <v-btn dark color="pink" @click="signInClicked">
          Sign In
        </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { Auth } from '@/auth';

export default {
  data() {
    if (this.$route.query.redirectTo) {
      return {
        message: 'You need to sign in to view this page.',
        redirect: this.$route.query.redirectTo
      };
    } else {
      return {
        message: 'Sign in to continue.',
        redirect: '/my/lists'
      };
    }
  },

  created() {
    this.checkAuthStatus();
  },

  methods: {
    signInClicked() {
      Auth.signIn(this.redirect);
    },

    async checkAuthStatus() {
      const { signedIn } = await Auth.getStatus();
      if (signedIn) {
        location.replace(location.origin + this.redirect);
      }
    }
  }
}
</script>
