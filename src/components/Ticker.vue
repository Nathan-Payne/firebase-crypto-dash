<template>
  <div class="white--text c-3" @click="getTickers">ticker {{ btcTicker }}</div>
</template>

<script>
export default {
  name: "Ticker",
  data() {
    return {
      btcTicker: "fetching..."
    };
  },
  methods: {
    getTickers() {
      //https://binance-docs.github.io/apidocs/spot/en/#individual-symbol-ticker-streams for data format
      const socket = new WebSocket(
        "wss://stream.binance.com:9443/ws/btcusdt@ticker"
      );
      socket.onmessage = event => {
        const parsedData = JSON.parse(event.data);
        const lastPrice = parseFloat(parsedData.c).toFixed(2);
        this.btcTicker = lastPrice;
      };
    }
  },
  mounted() {
    this.getTickers();
  }
};
</script>

<style></style>
