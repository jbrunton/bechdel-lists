<template>  
    <div class="chart-container" style="margin: 1px;"></div>
</template>

<style>
  svg > g > g:last-child { pointer-events: none }
</style>

<script>
/* global google */

const axios = require('axios');

export default {
  props: {
    stackedPercentage: Boolean
  },

  mounted() {
    this.loadCharts();
  },

  methods: {
    loadCharts() {
      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(this.drawChart);
    },

    async drawChart() {
      const ratingsResult = await axios.get('/api/lists/60/charts/count_by_year');
      var ratingsData = google.visualization.arrayToDataTable(ratingsResult.data);

      var options = {
        legend: { position: 'bottom', maxLines: 3 },
        bar: { groupWidth: '100%' },
        isStacked: this.stackedPercentage ? 'percent' : true,
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
          height: '70%',
          top: '5%'
        },
      };

      const container = this.$el;
      container.style.height = (container.offsetWidth * 0.6) + 'px';
      const chart = new google.visualization.ComboChart(container);
      chart.draw(ratingsData, options);
    }
  }
}
</script>
