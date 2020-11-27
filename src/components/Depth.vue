<template>
  <canvas id="depthChart" width="200" height="200"></canvas>
</template>

<script>
import Chart from 'chart.js'
import { mapGetters } from 'vuex'

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
                  suggestedMax: 50,
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
                  callback: function(tick) {
                    return Math.round(tick / 10) * 10
                  },
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
      this.chartData.data.labels = this.getPriceAxis
      this.chartData.data.datasets[0].data = this.getAmountAxis
      this.chartData.data.datasets[0].backgroundColor = this.backgroundColorArray()
      this.createdChart.update({ duration: 350 })
    },
    backgroundColorArray() {
      let askColors = []
      let bidColors = []
      const btcPrice = this.getBtcPrice
      const priceAxis = this.$store.getters.getPriceAxis
      for (let i = 0; i <= priceAxis.length; i++) {
        if (priceAxis[i] > btcPrice) {
          askColors.push('rgba(255, 34, 34, 1)')
        }
        if (priceAxis[i] < btcPrice) {
          bidColors.push('rgba(34, 221, 34, 1)')
        }
      }
      return [...askColors, ...bidColors]
    },
  },
  computed: {
    ...mapGetters(['isLoaded', 'getAmountAxis', 'getPriceAxis', 'getBtcPrice']),
  },
  watch: {
    getBtcPrice: {
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
