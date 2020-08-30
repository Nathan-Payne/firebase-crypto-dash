<template>
  <div id="candlestick-chart" ref="chart"></div>
</template>

<script>
import { createChart } from 'lightweight-charts'

export default {
  name: 'Chart',
  data() {
    return {
      chart: null,
    }
  },
  computed: {
    candlestickData() {
      return this.$store.getters.getCandlestickData
    },
  },
  methods: {
    resizeChart(width, height) {
      this.chart.applyOptions({
        width: width,
        height: height,
      })
    },
  },
  mounted() {
    this.chart = createChart(this.$refs.chart, {
      width: this.$refs.chart.innerWidth,
      height: this.$refs.chart.innerHeight,
      layout: {
        backgroundColor: '#181818',
        textColor: '#eee',
      },
      grid: {
        vertLines: {
          color: 'rgba(80, 80, 80, 0.02)',
        },
        horzLines: {
          color: 'rgba(80, 80, 80, 0.02)',
        },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    })
    const candlestickSeries = this.chart.addCandlestickSeries({
      borderVisible: false,
    })
    candlestickSeries.setData(this.candlestickData)

    const ro = new ResizeObserver(entries => {
      // resize observer (native JS)
      const cr = entries[0].contentRect
      this.resizeChart(cr.width, cr.height)
    })

    ro.observe(this.$refs.chart)
    window.addEventListener('resize', () => {
      this.resizeChart(
        this.$refs.chart.innerWidth,
        this.$refs.chart.innerHeight
      )
    })
  },
}
</script>

<style scoped>
#candlestick-chart {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
