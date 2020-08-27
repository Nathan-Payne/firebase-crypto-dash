<template>
  <v-container class="container" fluid>
    <section id="chart-section">
      <data-chart class="grid-item"></data-chart>
    </section>
    <section id="ticker-section">
      <data-ticker class="grid-item"></data-ticker>
    </section>
    <section id="depth-section">
      <data-depth
        class="grid-item"
        :style="depthChartStyles"
        v-if="$store.getters.isLoaded"
      ></data-depth>
    </section>
  </v-container>
</template>

<script>
// @ is an alias to /src
import Chart from "@/components/Chart";
import Ticker from "@/components/Ticker";
import Depth from "@/components/Depth";

export default {
  name: "Home",
  components: {
    "data-chart": Chart,
    "data-ticker": Ticker,
    "data-depth": Depth
  },
  data() {
    return {
      depthChartStyles: {
        position: "relative",
        width: "100%",
        height: "100%",
        paddingTop: "0"
      }
    };
  }
};
</script>

<style scoped>
#chart-section {
  grid-area: ct;
  height: 45vh;
}
#ticker-section {
  grid-area: tk;
}
#depth-section {
  grid-area: dt;
  justify-self: end;
  position: relative;
  height: 90vh;
  width: 300px;
}
.container {
  height: 100%;
  padding: 1rem;
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-template-areas:
    "ct ct ct ct ct ct ct ct dt dt"
    "ct ct ct ct ct ct ct ct dt dt"
    "tk tk .  .  .  .  .  .  dt dt";
}
.grid-item {
  padding-top: 1rem;
}
</style>
