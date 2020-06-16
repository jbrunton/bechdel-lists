<template>
  <v-container>
    <h1>What is this?</h1>
    <p>A small project that will (eventually) demo the following:</p>
    <p>
      <ul>
        <li>A small microservices app using <b>docker-compose</b> for easy local development and deployments.</li>
        <li>A non-trivial, cleanly architected backend
          <a href="https://github.com/jbrunton/bechdel-lists/tree/master/api">API</a> written using <b>Express</b>.
        </li>
        <li>A cleanly written <a href="https://github.com/jbrunton/bechdel-lists/tree/master/client">client app</a> using
        <b>Vue.js</b>
        </li>
      </ul>
    </p>
    <p>
      The app itself allows users to create lists of movies and assigns an aggregate Bechdel score for the list (based
      on the average). Bechdel scores are taken from the
      <a href="https://bechdeltest.com/api/v1/doc">bechdeltest.com API</a>.
    </p>
  </v-container>
</template>

<style>
  svg > g > g:last-child { pointer-events: none }
</style>
