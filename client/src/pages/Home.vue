<template>
  <v-container>
    <h1>What is this?</h1>
    <p>A small project that will (eventually) demo the following:</p>
    <p>
      <ul>
        <li>A small microservices app using <b>docker-compose</b> for easy local development and deployments.</li>
        <li>A non-trivial, cleanly architected backend
          <a href="https://github.com/jbrunton/bechdel-demo/tree/master/api">API</a> written using <b>Express</b>.
        </li>
        <li>A cleanly written <a href="https://github.com/jbrunton/bechdel-demo/tree/master/client">client app</a>
        written using <b>Vue.js</b>
        </li>
      </ul>
    </p>
    <p>
      The app itself allows users to create lists of movies and assigns an aggregate Bechdel score for the list (based
      on the average). Bechdel scores are taken from the
      <a href="https://bechdeltest.com/api/v1/doc">bechdeltest.com API</a>.
    </p>
    <div id="sign-in-button"></div>    
    </v-container>
</template>

<script>
/* global gapi */

export default {
  mounted () {
    gapi.signin2.render('sign-in-button', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': this.onAuthSuccess,
        'onfailure': this.onAuthFailure
      });
  },

  methods: {
    onAuthSuccess(googleUser) {
      var profile = googleUser.getBasicProfile();
      console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
      console.log('Name: ' + profile.getName());
      console.log('Image URL: ' + profile.getImageUrl());
      console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    },

    onAuthFailure(error) {
      console.log(error);
    }
  }
}
</script>