<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <router-link to="/" class="d-flex align-center">
        <v-icon large class="mr-4">mdi-filmstrip-box-multiple</v-icon>
        <v-toolbar-title class="white--text">
          Bechdel Lists
        </v-toolbar-title>
      </router-link>

      <v-spacer></v-spacer>

      <SignIn />

      <v-btn
        href="https://github.com/jbrunton/bechdel-demo"
        target="_blank"
        text
      >
        <v-icon>mdi-github</v-icon>
        <span class="ml-2">Source</span>
      </v-btn>
    </v-app-bar>

    <v-content>
      <v-container>
        <div id="app">
          <router-view/>
        </div>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import SignIn from './components/SignIn';

export default {
  components: {
    SignIn
  }
}
</script>
