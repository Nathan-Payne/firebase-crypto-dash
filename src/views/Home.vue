<template>
  <section id="chart-container">
    <data-chart></data-chart>
  </section>
</template>

<script>
// @ is an alias to /src
import Chart from "@/components/Chart.vue";

export default {
  name: "Home",
  components: {
    "data-chart": Chart
  }
};
</script>
