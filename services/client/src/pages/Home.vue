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
    </v-container>
</template>

<style>
  svg > g > g:last-child { pointer-events: none }
</style>

<script>
/* global google */

const axios = require('axios');

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function createChart(containerId, data, options) {
  const container = document.getElementById(containerId);
  container.style.height = (container.offsetWidth * 0.6) + 'px';
  const chart = new google.visualization.ColumnChart(container);
  chart.draw(data, options);
}

async function drawChart() {
  const result = await axios.get('/api/charts/ratings_by_year');
  var data = google.visualization.arrayToDataTable(result.data);

  var options = {
    legend: { position: 'top', maxLines: 3 },
    bar: { groupWidth: '100%' },
    isStacked: true,
    series: {
          0: { color: '#B71C1C' },
          1: { color: '#EF9A9A' },
          2: { color: '#90CAF9' },
          3: { color: '#1565C0' }
    },
    chartArea: {
      width: '85%',
      height: '80%',
      top: 20
    },
  };

  createChart('ratings_by_year', data, options);
  createChart('ratings_by_year_percentage', data, Object.assign(options, { isStacked: 'percent' }));
}
export default {
  
}
</script>