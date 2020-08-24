import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tickers: {
      BTCUSDT: {
        pair: "BTCUSDT",
        lastPrice: "",
        percentChange: ""
      },
      ETHUSDT: {
        pair: "ETHUSDT",
        lastPrice: "",
        percentChange: ""
      }
    }
  },
  getters: {
    getTickersArray: state => {
      let arr = [];
      for (let ticker in state.tickers) {
        arr.push(state.tickers[ticker]);
      }
      return arr;
    }
  },
  mutations: {
    updateTicker(state, tickerInfo) {
      for (let ticker in state.tickers) {
        if (state.tickers[ticker].pair === tickerInfo.pair) {
          state.tickers[ticker].lastPrice = tickerInfo.lastPrice;
          state.tickers[ticker].percentChange = tickerInfo.percentChange;
        }
      }
    }
  },
  actions: {
    async callBinanceSocket(context) {
      let tickerInfo = {
        pair: "",
        lastPrice: "",
        percentChange: ""
      };
      //https://binance-docs.github.io/apidocs/spot/en/#individual-symbol-ticker-streams for data format
      const socket = await new WebSocket(
        "wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker"
      );
      socket.onmessage = event => {
        const parsedData = JSON.parse(event.data);
        if (parsedData.stream == "btcusdt@ticker") {
          tickerInfo = {
            pair: "BTCUSDT",
            lastPrice: parseFloat(parsedData.data.c).toFixed(2),
            percentChange: parseFloat(parsedData.data.P).toFixed(2)
          };
        }
        if (parsedData.stream == "ethusdt@ticker") {
          tickerInfo = {
            pair: "ETHUSDT",
            lastPrice: parseFloat(parsedData.data.c).toFixed(2),
            percentChange: parseFloat(parsedData.data.P).toFixed(2)
          };
        }
        context.commit("updateTicker", tickerInfo);
      };
    }
  },
  modules: {}
});
