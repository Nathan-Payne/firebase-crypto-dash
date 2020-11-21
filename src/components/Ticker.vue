<template>
  <v-data-table
    dark
    class="elevation-3 border-reset"
    dense
    disable-pagination
    hide-default-footer
    no-data-text="Data not available at this time"
    mobile-breakpoint="460"
    :headers="headers"
    :items="tickers"
    :item-class="rowHighlight"
  >
  </v-data-table>
</template>

<script>
export default {
  name: 'Ticker',
  props: {
    tickerType: {
      type: String,
      default: 'usdt',
    },
  },
  data() {
    return {
      headers: [
        { text: 'Pair', value: 'pair' },
        { text: 'Price', value: 'lastPrice' },
        { text: '24hr % Change', value: 'percentChange' },
      ],
      tickers: [],
    }
  },
  computed: {
    getUsdtTickers() {
      return this.$store.getters.getTickersArray.usdtArr
    },
    getBtcTickers() {
      return this.$store.getters.getTickersArray.btcArr
    },
  },
  methods: {
    getTickers() {
      if (this.tickerType === 'usdt') {
        return this.getUsdtTickers
      }
      if (this.tickerType === 'btc') {
        return this.getBtcTickers
      }
    },
    rowHighlight(row) {
      if (parseFloat(row.percentChange) > 0) {
        return { 'green-border': true }
      } else {
        return { 'red-border': true }
      }
    },
  },
  mounted() {
    this.tickers = this.getTickers()
  },
}
</script>

<style>
.border-reset td {
  border: 0px solid black !important;
}
.red-border td:nth-child(1) {
  border-left: 5px solid #ff2222 !important;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
.green-border td:nth-child(1) {
  border-left: 5px solid #22dd22 !important;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
thead tr th {
  border-bottom: 0px solid black !important;
}
</style>
