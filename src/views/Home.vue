<template>
  <v-container class="container" fluid>
    <section id="chart-section">
      <data-chart
        class="grid-item chart-size"
        v-if="$store.getters.isLoaded"
      ></data-chart>
    </section>
    <section id="depth-section">
      <data-depth
        class="grid-item"
        :style="depthChartStyles"
        v-if="$store.getters.isLoaded"
      ></data-depth>
    </section>
    <section id="usdt-ticker-section">
      <data-ticker
        v-if="$store.getters.isLoaded"
        class="grid-item"
        :tickerType="'usdt'"
      ></data-ticker>
    </section>
    <section id="btc-ticker-section">
      <data-ticker
        v-if="$store.getters.isLoaded"
        class="grid-item"
        :tickerType="'btc'"
      ></data-ticker>
    </section>
  </v-container>
</template>

<script>
// @ is an alias to /src
import Chart from '@/components/Chart'
import Ticker from '@/components/Ticker'
import Depth from '@/components/Depth'

export default {
  name: 'Home',
  title: 'Bitcoin Perspective | A Bitcoin Data Dashboard',
  components: {
    'data-chart': Chart,
    'data-ticker': Ticker,
    'data-depth': Depth,
  },
  data() {
    return {
      depthChartStyles: {
        position: 'relative',
        width: '100%',
        height: '100%',
        paddingTop: '0',
      },
    }
  },
}
</script>

<style scoped>
#chart-section {
  grid-area: ct;
}
#chart-section .chart-size {
  position: relative;
  width: 100%;
  height: 100%;
}
#depth-section {
  grid-area: dt;
  justify-self: end;
  position: relative;
  height: 90vh;
  width: 100%;
}
#usdt-ticker-section {
  grid-area: tu;
}
#btc-ticker-section {
  grid-area: tb;
}
.container {
  height: 100%;
  padding: 1rem 1rem 0rem 1rem;
  display: grid;
  gap: 0.7rem;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-template-areas:
    'ct ct ct ct ct ct ct ct dt dt'
    'ct ct ct ct ct ct ct ct dt dt'
    'tu tu tu tu tb tb tb tb dt dt';
}
.grid-item {
  padding-top: 1rem;
}

@media (max-width: 768px) {
  .container {
    display: flex;
    flex-direction: column;
  }
  #chart-section .chart-size {
    width: 90vw;
    height: 90vh;
  }
}
</style>
