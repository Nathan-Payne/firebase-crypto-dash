<script>
import { HorizontalBar } from "vue-chartjs";

const backgroundColorArray = () => {
  let askColors = [];
  let bidColors = [];
  for (let i = 0; i < 20; i++) {
    askColors.push("rgba(255, 0, 0, 0.8)");
    bidColors.push("rgba(0, 255, 0, 0.8)");
  }
  return [...askColors, ...bidColors];
};

export default {
  name: "Depth",
  extends: HorizontalBar,
  data() {
    return {
      chartData: {
        labels: this.$store.getters.getPriceAxis,
        datasets: [
          {
            data: this.$store.getters.getAmountAxis,
            backgroundColor: backgroundColorArray(),
            barPercentage: 0.9,
            categoryPercentage: 1,
            barThickness: "flex"
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          displayColors: false,
          xPadding: 20,
          callbacks: {
            label: tooltipItem => {
              return `Amount: ${tooltipItem.value}`;
            }
          }
        },
        scales: {
          xAxes: [
            {
              id: "Amount of BTC on book",
              type: "linear",
              position: "bottom",
              gridLines: {
                display: true
              },
              ticks: {
                beginAtZero: true
              }
            }
          ],
          yAxes: [
            {
              id: "BTC/USDT Price",
              gridLines: {
                display: false,
                drawBorder: false
              }
            }
          ]
        }
      }
    };
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  }
};
</script>
