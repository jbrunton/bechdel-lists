<template>
  <v-container>
    {{message}}
    <v-textarea label="ID Token" v-model="idToken"></v-textarea>
  </v-container>
</template>

<script>
/* global gapi */
import { Auth } from '../../auth';

export default {
  data() {
    return {
      message: 'Checking auth status...',
      idToken: ''
    }
  },

  mounted() {
    this.getIdToken();
  },

  methods: {
    async getIdToken() {
      try {
        await Auth.authenticate();
        const auth2 = gapi.auth2.getAuthInstance();
        const googleUser = auth2.currentUser.get();
        this.message = '';
        this.idToken = googleUser.getAuthResponse().id_token
      } catch (e) {
        console.log(e);
        this.message = "Could not get token. Check you're signed in with Google, and check errors in console."
      }
    }
  }
}
</script>
