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
    stackedPercentage: Boolean,
    chartOptions: Object,
    dataSource: String,
    title: String,
    percentageHeight: Number
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
      const ratingsResult = await axios.get(this.dataSource);
      const ratingsData = google.visualization.arrayToDataTable(ratingsResult.data);

      const options = {
        title: this.title,
        legend: { position: 'bottom', maxLines: 3 },
        bar: { groupWidth: '100%' },
        isStacked: this.stackedPercentage ? 'percent' : true,
        seriesType: 'bars',
        chartArea: {
          left: 40,
          right: 40,
          top: 40,
          bottom: 40
        },
      };

      const container = this.$el;
      container.style.height = (container.offsetWidth * (this.percentageHeight || 0.6)) + 'px';
      const chart = new google.visualization.ComboChart(container);
      chart.draw(ratingsData, Object.assign(options, this.chartOptions));
    }
  }
}
</script>
