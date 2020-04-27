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

      <SignIn />

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
import SignIn from './components/SignIn';

export default {
  components: {
    SignIn
  }
}
</script>
