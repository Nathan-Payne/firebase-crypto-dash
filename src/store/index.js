import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

function sortNumbersDesc(a, b) {
  return b[0] - a[0];
}

export default new Vuex.Store({
  state: {
    loaded: false,
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
    },
    orderbookDepth: {
      priceAxis: [],
      amountAxis: []
    }
  },
  getters: {
    getTickersArray: state => {
      let arr = [];
      for (let ticker in state.tickers) {
        arr.push(state.tickers[ticker]);
      }
      return arr;
    },
    getPriceAxis(state) {
      return state.orderbookDepth.priceAxis;
    },
    getAmountAxis(state) {
      return state.orderbookDepth.amountAxis;
    },
    isLoaded(state) {
      return state.loaded;
    }
  },
  mutations: {
    loaded(state) {
      state.loaded = true;
    },
    updateTicker(state, tickerInfo) {
      for (let ticker in state.tickers) {
        if (state.tickers[ticker].pair === tickerInfo.pair) {
          state.tickers[ticker].lastPrice = tickerInfo.lastPrice;
          state.tickers[ticker].percentChange = tickerInfo.percentChange;
        }
      }
    },
    updateDepthPrice(state, priceAxis) {
      state.orderbookDepth.priceAxis = priceAxis.dataArr;
    },
    updateDepthAmount(state, amountAxis) {
      state.orderbookDepth.amountAxis = amountAxis.dataArr;
    }
  },
  actions: {
    async callBinanceSocket(context) {
      let tickerInfo = {
        pair: "",
        lastPrice: "",
        percentChange: ""
      };
      let count = 0;
      //https://binance-docs.github.io/apidocs/spot/en/#individual-symbol-ticker-streams for data format
      const socket = await new WebSocket(
        "wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker/btcusdt@depth20"
      );
      socket.onmessage = event => {
        const parsedData = JSON.parse(event.data);
        if (parsedData.stream == "btcusdt@ticker") {
          tickerInfo = {
            pair: "BTCUSDT",
            lastPrice: parseFloat(parsedData.data.c).toFixed(2),
            percentChange: parseFloat(parsedData.data.P).toFixed(2)
          };
          context.commit("updateTicker", tickerInfo);
        }
        if (parsedData.stream == "ethusdt@ticker") {
          tickerInfo = {
            pair: "ETHUSDT",
            lastPrice: parseFloat(parsedData.data.c).toFixed(2),
            percentChange: parseFloat(parsedData.data.P).toFixed(2)
          };
          context.commit("updateTicker", tickerInfo);
        }
        if (parsedData.stream == "btcusdt@depth20") {
          const asks = parsedData.data.asks.sort(sortNumbersDesc);
          const bids = parsedData.data.bids;
          const orderedBookArr = [...asks, ...bids];
          let priceAxis = orderedBookArr.map(el => {
            return parseFloat(el[0]);
          });
          let amountAxis = orderedBookArr.map(el => {
            return parseFloat(el[1]);
          });
          context.commit({
            type: "updateDepthPrice",
            dataArr: priceAxis
          });
          context.commit({
            type: "updateDepthAmount",
            dataArr: amountAxis
          });
        }
        if (count > 1 && count < 5) {
          context.commit("loaded");
        }
        if (count < 5) {
          count++;
        }
      };
    }
  },
  modules: {}
});
