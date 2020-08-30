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
    candlestickSeries() {
      return this.chart.addCandlestickSeries({
        borderVisible: false,
      })
    },
    currentCandlestick() {
      let arr = this.$store.getters.getCandlestickData
      return arr[arr.length - 1]
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
  watch: {
    candlestickData() {},
  },
  mounted() {
    this.chart = createChart(this.$refs.chart, {
      width: this.$refs.chart.innerWidth,
      height: this.$refs.chart.innerHeight,
      layout: {
        backgroundColor: '#181818',
        textColor: '#eee',
        fontFamily: 'Roboto',
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
      crosshair: {
        mode: 0,
      },
    })
    this.candlestickSeries.setData(this.candlestickData)

    // Live updates
    let currentBar = this.currentCandlestick
    setInterval(() => {
      let price = parseFloat(this.$store.getters.getBtcPrice)
      if (currentBar.open === null) {
        currentBar.open = price
        currentBar.high = price
        currentBar.low = price
        currentBar.close = price
      } else {
        currentBar.close = price
        currentBar.high = Math.max(currentBar.high, price)
        currentBar.low = Math.min(currentBar.low, price)
      }
      console.log(currentBar)
      this.candlestickSeries.update(currentBar)
    }, 2000)

    // Handle making chart responsive
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
  padding-top: 0;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}
</style>
