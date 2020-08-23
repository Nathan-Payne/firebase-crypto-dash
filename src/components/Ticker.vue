<template>
  <v-data-table
    dark
    class="elevation-3"
    dense
    disable-pagination
    hide-default-footer
    no-data-text="Data not available at this time"
    :headers="headers"
    :items="tickers"
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
          percentChange: "1000%"
        },
        {
          pair: "ETH/USDT",
          price: "",
          percentChange: "1009%"
        }
      ]
    };
  },
  methods: {
    getTickers() {
      let lastBtcPrice, lastEthPrice;
      //https://binance-docs.github.io/apidocs/spot/en/#individual-symbol-ticker-streams for data format
      const socket = new WebSocket(
        "wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker"
      );
      socket.onmessage = event => {
        const parsedData = JSON.parse(event.data);
        if (parsedData.stream == "btcusdt@ticker") {
          lastBtcPrice = parseFloat(parsedData.data.c).toFixed(2);
        }
        if (parsedData.stream == "ethusdt@ticker") {
          lastEthPrice = parseFloat(parsedData.data.c).toFixed(2);
        }
        this.tickers.forEach(ticker => {
          if (ticker.pair === "BTC/USDT") {
            ticker.price = lastBtcPrice;
          }
          if (ticker.pair === "ETH/USDT") {
            ticker.price = lastEthPrice;
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

<style></style>
