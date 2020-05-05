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
        <li>A cleanly written <a href="https://github.com/jbrunton/bechdel-demo/tree/master/client">client app</a> using
        <b>Vue.js</b>
        </li>
      </ul>
    </p>
    <p>
      The app itself allows users to create lists of movies and assigns an aggregate Bechdel score for the list (based
      on the average). Bechdel scores are taken from the
      <a href="https://bechdeltest.com/api/v1/doc">bechdeltest.com API</a>.
    </p>
    <v-row>
      <v-col>
        <div id="ratings_by_year"></div>
      </v-col>
      <v-col>
        <div id="ratings_by_year_percentage"></div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div id="top_10_ratings_by_year"></div>
      </v-col>
      <v-col>
        <div id="top_10_ratings_by_year_percentage"></div>
      </v-col>
    </v-row>
    </v-container>
</template>

<style>
  svg > g > g:last-child { pointer-events: none }
</style>

<script>
/* global google */

const axios = require('axios');

function loadCharts() {
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawCharts);
}

function createChart(containerId, data, options) {
  const container = document.getElementById(containerId);
  container.style.height = (container.offsetWidth * 0.6) + 'px';
  const chart = new google.visualization.ComboChart(container);
  chart.draw(data, options);
}

async function drawCharts() {
  const ratingsResult = await axios.get('/api/charts/ratings_by_year');
  var ratingsData = google.visualization.arrayToDataTable(ratingsResult.data);

  const top10RatingsResult = await axios.get('/api/charts/top_10_ratings_by_year');
  var top10RatingsData = google.visualization.arrayToDataTable(top10RatingsResult.data);

  var options = {
    legend: { position: 'top', maxLines: 3 },
    bar: { groupWidth: '100%' },
    isStacked: true,
    series: {
          0: { color: '#C62828' }, // red darken-3
          1: { color: '#EF9A9A' }, // red lighten-1
          2: { color: '#90CAF9' }, // blue lighten-3
          3: { color: '#1E88E5' }, // blue darken-1
          4: { type: 'line', targetAxisIndex: 1, color: '#EC407A' }
    },
    seriesType: 'bars',
    chartArea: {
      width: '85%',
      height: '80%',
      top: 20
    },
  };

  createChart('ratings_by_year', ratingsData, options);
  createChart('ratings_by_year_percentage', ratingsData, Object.assign(options, { isStacked: 'percent' }));

  createChart('top_10_ratings_by_year', top10RatingsData, Object.assign(options, { isStacked: true }));
  createChart('top_10_ratings_by_year_percentage', top10RatingsData, Object.assign(options, { isStacked: 'percent' }));
}
export default {
  created() {
    loadCharts();
  }
}
</script>