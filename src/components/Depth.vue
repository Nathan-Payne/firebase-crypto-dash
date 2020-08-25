<script>
import { HorizontalBar, mixins } from "vue-chartjs";

export default {
  name: "Depth",
  extends: HorizontalBar,
  mixins: [mixins.reactiveProp],
  data() {
    return {
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
