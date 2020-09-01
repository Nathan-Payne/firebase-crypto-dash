<template>
  <v-app>
    <v-app-bar app color="c-3" flat dense>
      <v-toolbar-title class="white--text px-10"
        >Gnomes secret data</v-toolbar-title
      >
      <v-spacer></v-spacer>
      <!-- <v-app-bar-nav-icon @click="showMenu = true"></v-app-bar-nav-icon> -->
    </v-app-bar>

    <v-navigation-drawer
      dark
      color="c-3"
      floating
      expand-on-hover
      width="160"
      height="85"
      mini-variant-width="40"
      permanent
      absolute
      class="nav-position"
      right
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

    <v-main class="c-4">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { Chart } from 'chart.js'
Chart.defaults.global.legend.display = false

export default {
  name: 'App',
  data: () => ({
    showMenu: false,
  }),
  mounted() {
    let chartInterval = this.$store.getters.getChartInterval
    this.$store.dispatch('callBinanceSocket', { chartInterval })
    this.$store.dispatch('getCandlestickData', { interval: chartInterval })
  },
}
</script>

<style>
.active-link {
  background-color: #0d7377;
}
.nav-position {
  position: absolute;
  top: 45vh !important;
  border-radius: 10px;
}
</style>
