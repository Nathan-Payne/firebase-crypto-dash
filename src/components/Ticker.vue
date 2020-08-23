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
  name: "Ticker",
  data() {
    return {
      // btcTicker: "fetching...",
      // ethTicker: "fetching...",
      headers: [
        { text: "Pair", value: "pair" },
        { text: "Price", value: "price" },
        { text: "% Change", value: "percentChange" }
      ],
      tickers: [
        {
          pair: "BTC/USDT",
          price: "",
          percentChange: ""
        },
        {
          pair: "ETH/USDT",
          price: "",
          percentChange: ""
        }
      ]
    };
  },
  methods: {
    rowHighlight(row) {
      if (parseFloat(row.percentChange) > 0) {
        return { "green-border": true };
      } else {
        return { "red-border": true };
      }
    },
    getTickers() {
      let lastBtcPrice, lastEthPrice, btcChange, ethChange;
      //https://binance-docs.github.io/apidocs/spot/en/#individual-symbol-ticker-streams for data format
      const socket = new WebSocket(
        "wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker"
      );
      socket.onmessage = event => {
        const parsedData = JSON.parse(event.data);
        if (parsedData.stream == "btcusdt@ticker") {
          lastBtcPrice = parseFloat(parsedData.data.c).toFixed(2);
          btcChange = parseFloat(parsedData.data.P).toFixed(2)
        }
        if (parsedData.stream == "ethusdt@ticker") {
          lastEthPrice = parseFloat(parsedData.data.c).toFixed(2);
          ethChange = parseFloat(parsedData.data.P).toFixed(2);
        }
        this.tickers.forEach(ticker => {
          if (ticker.pair === "BTC/USDT") {
            ticker.price = lastBtcPrice;
            ticker.percentChange = btcChange;
          }
          if (ticker.pair === "ETH/USDT") {
            ticker.price = lastEthPrice;
            ticker.percentChange = ethChange;
          }
        });
      };
    }
  },
  mounted() {
    this.getTickers();
  }
};
</script>

<style>
.border-reset td {
  border: 0px solid black !important;
}
.red-border td:nth-child(1) {
  border-left: 5px solid red !important;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
.green-border td:nth-child(1) {
  border-left: 5px solid lime !important;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
thead tr th {
  border-bottom: 0px solid black !important;
}
</style>
