<template>
  <canvas id="depthChart" width="200" height="200"></canvas>
</template>

<script>
import Chart from 'chart.js'

export default {
  name: 'Depth',
  data() {
    return {
      chartData: {
        type: 'horizontalBar',
        data: {
          labels: [],
          datasets: [
            {
              label: 'Amount (BTC)',
              data: [],
              backgroundColor: this.backgroundColorArray(),
              barPercentage: 0.95,
              categoryPercentage: 1,
              barThickness: 'flex',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          tooltips: {
            displayColors: false,
            xPadding: 20,
            callbacks: {
              label: tooltipItem => {
                return `Amount: ${tooltipItem.value}`
              },
            },
          },
          scales: {
            xAxes: [
              {
                id: 'Amount of BTC on book',
                type: 'linear',
                position: 'bottom',
                gridLines: {
                  display: true,
                },
                ticks: {
                  beginAtZero: true,
                  suggestedMax: 10,
                },
                scaleLabel: {
                  display: true,
                  labelString: 'Amount of BTC',
                },
              },
            ],
            yAxes: [
              {
                id: 'BTC/USDT Price',
                gridLines: {
                  display: false,
                  drawBorder: false,
                },
                scaleLabel: {
                  display: true,
                  labelString: 'BTC/USDT Price',
                },
                ticks: {
                  precision: 2,
                },
              },
            ],
          },
        },
      },
      createdChart: null,
    }
  },
  methods: {
    createChart(chartId, chartData) {
      const ctx = document.getElementById(chartId)
      // eslint-disable-next-line no-unused-vars
      const depthChart = new Chart(ctx, {
        type: chartData.type,
        data: chartData.data,
        options: chartData.options,
      })
      return depthChart
    },
    fillData() {
      this.chartData.data.labels = this.$store.getters.getPriceAxis
      this.chartData.data.datasets[0].data = this.$store.getters.getAmountAxis
      this.createdChart.update({ duration: 500 })
    },
    backgroundColorArray() {
      let askColors = []
      let bidColors = []
      for (let i = 0; i < this.$store.getters.getPriceAxis.length; i++) {
        askColors.push('rgba(34, 221, 34, 1)')
        bidColors.push('rgba(255, 34, 34, 1)')
      }
      return [...askColors, ...bidColors]
    },
  },
  computed: {
    storedChartData() {
      return this.$store.getters.getAmountAxis
    },
  },
  watch: {
    storedChartData: {
      handler: function() {
        this.fillData()
      },
      deep: true,
    },
  },
  mounted() {
    this.createdChart = this.createChart('depthChart', this.chartData)
    this.fillData()
  },
}
</script>
