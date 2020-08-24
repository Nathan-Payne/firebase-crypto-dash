<script>
import { HorizontalBar } from "vue-chartjs";

export default {
  name: "Depth",
  extends: HorizontalBar,
  data() {
    return {
      dataset: {
        labels: [
          "priceAggHigh",
          "priceAgginc",
          "m1",
          "m1",
          "m1",
          "m1",
          "m1",
          "m1",
          "priceAggInc",
          "priceAggLow"
        ],
        datasets: [
          {
            data: [12, 19, 3, 5, 7, 8, 22, 21, 33, 14],
            backgroundColor: [
              "rgba(0, 255, 0, 0.8)",
              "rgba(0, 255, 0, 0.8)",
              "rgba(255, 0, 0, 0.8)",
              "rgba(255, 0, 0, 0.8)",
              "rgba(255, 0, 0, 0.8)",
              "rgba(255, 0, 0, 0.8)",
              "rgba(255, 0, 0, 0.8)",
              "rgba(255, 0, 0, 0.8)",
              "rgba(255, 0, 0, 0.8)",
              "rgba(255, 0, 0, 0.8)"
            ],
            barPercentage: 0.98,
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
    this.renderChart(this.dataset, this.options);
  }
};
</script>
