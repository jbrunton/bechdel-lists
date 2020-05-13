<template>  
    <div class="chart-container" style="margin: 1px;"></div>
</template>

<style>
  svg > g > g:last-child { pointer-events: none }
</style>

<script>
/* global google */

export default {
  props: {
    stackedPercentage: Boolean,
    chartOptions: Object,
    data: Array,
    title: String,
    percentageHeight: Number
  },

  methods: {
    loadCharts() {
      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(this.drawChart);
    },

    async drawChart() {
      const dataTable = google.visualization.arrayToDataTable(this.data);

      const options = {
        title: this.title,
        legend: { position: 'bottom', maxLines: 3 },
        bar: { groupWidth: '100%' },
        isStacked: this.stackedPercentage ? 'percent' : true,
        seriesType: 'bars',
        interpolateNulls: true,
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
      chart.draw(dataTable, Object.assign(options, this.chartOptions));
    }
  },

  watch: {
    data: function(data) {
      if (data != null) {
        this.loadCharts();
      }
    }
  }
}
</script>
