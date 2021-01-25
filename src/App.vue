<template>
  <v-app>
    <v-app-bar app color="dark" flat dense>
      <v-toolbar-title class="white--text pl-10 font-weight-bold"
        ><router-link to="/" class="mt-6 white--text text-decoration-none">
          <svg
            class="accent--text"
            style="width:26px;height:26px;"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M14.24 10.56C13.93 11.8 12 11.17 11.4 11L11.95 8.82C12.57 9 14.56 9.26 14.24 10.56M11.13 12.12L10.53 14.53C11.27 14.72 13.56 15.45 13.9 14.09C14.26 12.67 11.87 12.3 11.13 12.12M21.7 14.42C20.36 19.78 14.94 23.04 9.58 21.7C4.22 20.36 .963 14.94 2.3 9.58C3.64 4.22 9.06 .964 14.42 2.3C19.77 3.64 23.03 9.06 21.7 14.42M14.21 8.05L14.66 6.25L13.56 6L13.12 7.73C12.83 7.66 12.54 7.59 12.24 7.53L12.68 5.76L11.59 5.5L11.14 7.29C10.9 7.23 10.66 7.18 10.44 7.12L10.44 7.12L8.93 6.74L8.63 7.91C8.63 7.91 9.45 8.1 9.43 8.11C9.88 8.22 9.96 8.5 9.94 8.75L8.71 13.68C8.66 13.82 8.5 14 8.21 13.95C8.22 13.96 7.41 13.75 7.41 13.75L6.87 15L8.29 15.36C8.56 15.43 8.82 15.5 9.08 15.56L8.62 17.38L9.72 17.66L10.17 15.85C10.47 15.93 10.76 16 11.04 16.08L10.59 17.87L11.69 18.15L12.15 16.33C14 16.68 15.42 16.54 16 14.85C16.5 13.5 16 12.7 15 12.19C15.72 12 16.26 11.55 16.41 10.57C16.61 9.24 15.59 8.53 14.21 8.05Z"
            />
          </svg>
          Perspective
        </router-link></v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-app-bar-nav-icon
        @click="showMenu = !showMenu"
        color="white"
      ></v-app-bar-nav-icon>
    </v-app-bar>

    <v-navigation-drawer
      dark
      color="dark"
      width="160"
      height="85"
      fixed
      class="nav-location"
      temporary
      right
      v-model="showMenu"
    >
      <v-list nav dense class="ma-0 pa-0">
        <v-list-item-group active-class="active-link">
          <v-list-item to="/" exact>
            <v-list-item-icon>
              <v-icon>mdi-view-dashboard</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item>

          <v-list-item to="/about" exact>
            <v-list-item-icon>
              <v-icon>mdi-format-text-variant-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title>About</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main class="darker">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { Chart } from 'chart.js'
import { mapActions } from 'vuex'
Chart.defaults.global.legend.display = false

export default {
  name: 'App',
  title: 'Foo',
  data: () => ({
    showMenu: false,
  }),
  methods: {
    ...mapActions([
      'initTickers',
      'callBinanceSocket',
      'getCandlestickData',
      'getOrderbookSnapshot', //dispatched from within websocket
    ]),
  },
  created() {
    let chartInterval = this.$store.getters.getChartInterval
    this.initTickers() //generates all ticker formats from data object in state
    this.callBinanceSocket({ chartInterval }) //orderbook dispatched once btcPrice streaming
    this.getCandlestickData({ interval: chartInterval }) //gets Kline data from REST api
  },
}
</script>

<style>
.active-link {
  background-color: #0d7377;
}
.nav-location {
  position: absolute;
  top: 8vh !important;
}
</style>
