<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="10">
        <v-banner single-line>
          <v-avatar slot="icon" color="pink" size="40">
            <v-icon icon="mdi-lock" color="white">mdi-lock</v-icon>
          </v-avatar>
          You need to sign in to view this page.
        </v-banner>
        <SignIn v-bind:redirect="$route.query.redirectTo" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SignIn from '@/components/SignIn';

export default {
  components: {
    SignIn
  }
}
</script>
