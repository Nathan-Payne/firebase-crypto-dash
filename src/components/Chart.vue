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
    currentCandle() {
      return this.$store.getters.getCurrentCandle
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
    const candleseries = this.chart.addCandlestickSeries({
      borderVisible: false,
      upColor: '#22dd22',
      downColor: '#ee4242',
      borderUpColor: '#22dd22',
      borderDownColor: '#ee4242',
      wickUpColor: '#22dd22',
      wickDownColor: '#ee4242',
    })
    candleseries.setData(this.candlestickData)
    setInterval(() => {
      candleseries.update(this.currentCandle)
    }, 1000)

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
