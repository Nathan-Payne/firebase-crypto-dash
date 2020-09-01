<template>
  <v-data-table
    dark
    class="elevation-3 border-reset"
    dense
    disable-pagination
    hide-default-footer
    no-data-text="Data not available at this time"
    :headers="headers"
    :items="tickers"
    :item-class="rowHighlight"
  >
  </v-data-table>
</template>

<script>
export default {
  name: 'Ticker',
  data() {
    return {
      headers: [
        { text: 'Pair', value: 'pair' },
        { text: 'Price', value: 'lastPrice' },
        { text: '% Change', value: 'percentChange' },
      ],
      tickers: this.$store.getters.getTickersArray,
    }
  },
  methods: {
    rowHighlight(row) {
      if (parseFloat(row.percentChange) > 0) {
        return { 'green-border': true }
      } else {
        return { 'red-border': true }
      }
    },
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
