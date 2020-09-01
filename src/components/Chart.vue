<template>
  <div id="candlestick-chart" ref="chart">
    <div class="legend">BTCUSDT {{ this.$store.getters.getChartInterval }}</div>
  </div>
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
      downColor: '#ff2222',
      borderUpColor: '#22dd22',
      borderDownColor: '#ff2222',
      wickUpColor: '#22dd22',
      wickDownColor: '#ff2222',
    })
    candleseries.setData(this.candlestickData)
    setInterval(() => {
      candleseries.update(this.currentCandle)
    }, 1000)

    // Handle making chart responsive
    const ro = new ResizeObserver(entries => {
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
  position: relative;
  padding-top: 0;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.legend {
  width: 96px;
  height: 70px;
  position: absolute;
  top: 10px;
  left: 12px;
  padding: 0.2rem;
  font-size: 1.4rem;
  color: #eeeeee;
  text-align: left;
  z-index: 1000;
  pointer-events: none;
}
</style>
