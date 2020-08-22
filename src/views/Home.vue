<template>
  <v-container class="grid-container">
    <section id="chart-section">
      <data-chart class="grid-item"></data-chart>
    </section>
    <section id="ticker-section">
      <data-ticker class="grid-item"></data-ticker>
    </section>
    <section id="movers-section">
      <data-movers class="grid-item"></data-movers>
    </section>
  </v-container>
</template>

<script>
// @ is an alias to /src
import Chart from "@/components/Chart";
import Ticker from "@/components/Ticker";
import Movers from "@/components/Movers";

export default {
  name: "Home",
  components: {
    "data-chart": Chart,
    "data-ticker": Ticker,
    "data-movers": Movers
  }
};
</script>

<style scoped>
#chart-section {
  grid-area: ct;
}
#ticker-section {
  grid-area: tk;
}
#movers-section {
  grid-area: mv;
}
.container {
  height: 100%;
  padding: 1rem;
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: auto;
  grid-template-areas:
    "ct ct ct ct ct ct ct ct"
    "ct ct ct ct ct ct ct ct"
    "tk tk tk tk mv mv mv mv";
}
.grid-item {
  height: 100%;
}
</style>
