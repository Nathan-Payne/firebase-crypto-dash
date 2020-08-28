<template>
  <div id="candlestick-chart" class="white--text c-2"></div>
</template>

<script>
import { createChart } from "lightweight-charts";

export default {
  name: "Chart",
  data() {
    return {
      candlestickData: [
        {
          time: "2018-12-19",
          open: 141.77,
          high: 170.39,
          low: 120.25,
          close: 145.72
        },
        {
          time: "2018-12-20",
          open: 145.72,
          high: 147.99,
          low: 100.11,
          close: 108.19
        }
      ]
    };
  },
  methods: {
    createCandlestickChart() {
      const chart = createChart(document.querySelector("#candlestick-chart"), {
        width: 800,
        height: 400,
        layout: {
          backgroundColor: "#181818",
          textColor: "#eee"
        },
        grid: {
          vertLines: {
            color: "rgba(80, 80, 80, 0.02)"
          },
          horzLines: {
            color: "rgba(80, 80, 80, 0.02)"
          }
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false
        }
      });
      const candlestickSeries = chart.addCandlestickSeries({
        borderVisible: false
      });
      candlestickSeries.setData(this.candlestickData);
    }
  },
  mounted() {
    this.createCandlestickChart();
  }
};
</script>

<style scoped></style>
