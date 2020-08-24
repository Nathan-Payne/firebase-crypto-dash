<template>
  <v-container class="grid-container">
    <section id="chart-section">
      <data-chart class="grid-item"></data-chart>
    </section>
    <section id="ticker-section">
      <data-ticker class="grid-item"></data-ticker>
    </section>
    <section id="depth-section">
      <data-depth class="grid-item" :style="depthChartStyles"></data-depth>
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
        width: "500px",
        maxHeight: "99%",
        position: "relative",
        paddingTop: "0"
      }
    };
  }
};
</script>

<style scoped>
#chart-section {
  grid-area: ct;
  height: 50vh;
}
#ticker-section {
  grid-area: tk;
}
#depth-section {
  grid-area: dt;
  display: flex;
  justify-content: center;
  position: relative;
}
.container {
  height: 100%;
  padding: 1rem;
  display: grid;
  gap: 1rem;
  /* grid-template-columns: repeat(8, 1fr); */
  /* grid-template-rows: repeat(4, 1fr); */
  grid-template-areas:
    "ct ct ct ct ct ct ct ct"
    "ct ct ct ct ct ct ct ct"
    "ct ct ct ct ct ct ct ct"
    "tk tk tk tk dt dt dt dt";
}
.grid-item {
  padding-top: 1rem;
}
</style>
