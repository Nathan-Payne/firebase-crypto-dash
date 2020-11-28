import Vue from 'vue'
import Vuex from 'vuex'
import initTickers from './modules/initTickers'
import orderbookSnapshot from './modules/orderbook'
import historicalCandlesticks from './modules/historicalCandlesticks'
import websocketStream from './modules/websocketStream'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loaded: false, // confirm websocket streaming data
    chartInterval: '5m',
    allUsdtTickers: [
      { urlName: 'btcusdt', uppercaseName: 'BTCUSDT' },
      { urlName: 'ethusdt', uppercaseName: 'ETHUSDT' },
      { urlName: 'linkusdt', uppercaseName: 'LINKUSDT' },
      { urlName: 'adausdt', uppercaseName: 'ADAUSDT' },
    ],
    allBtcTickers: [
      { urlName: 'ethbtc', uppercaseName: 'ETHBTC' },
      { urlName: 'linkbtc', uppercaseName: 'LINKBTC' },
      { urlName: 'adabtc', uppercaseName: 'ADABTC' },
    ],
    usdtTickers: {
      BTCUSDT: {
        pair: 'BTCUSDT',
        lastPrice: '',
        percentChange: '',
      },
    },
    btcTickers: {
      ETHBTC: {
        pair: 'ETHBTC',
        lastPrice: '',
        percentChange: '',
      },
    },
    currentCandle: {},
  },

  getters: {
    isLoaded: state => state.loaded,
    getChartInterval: state => state.chartInterval,
    getTickersArray: state => {
      let usdtArr = []
      let btcArr = []
      for (let ticker in state.usdtTickers) {
        usdtArr.push(state.usdtTickers[ticker])
      }
      for (let ticker in state.btcTickers) {
        btcArr.push(state.btcTickers[ticker])
      }
      return { usdtArr, btcArr }
    },
    getBtcPrice: state => state.usdtTickers.BTCUSDT.lastPrice,
    getCurrentCandle: state => state.currentCandle,
  },

  mutations: {
    loaded: state => (state.loaded = true),
    createUsdtTicker(rootState, initTicker) {
      rootState.usdtTickers[initTicker.pair] = initTicker
    },
    createBtcTicker(rootState, initTicker) {
      rootState.btcTickers[initTicker.pair] = initTicker
    },
    updateTicker(state, tickerInfo) {
      for (let ticker in state.usdtTickers) {
        if (state.usdtTickers[ticker].pair === tickerInfo.pair) {
          state.usdtTickers[ticker].lastPrice = parseFloat(
            tickerInfo.lastPrice
          ).toPrecision(5)
          state.usdtTickers[ticker].percentChange = tickerInfo.percentChange
        }
      }
      for (let ticker in state.btcTickers) {
        if (state.btcTickers[ticker].pair === tickerInfo.pair) {
          state.btcTickers[ticker].lastPrice = tickerInfo.lastPrice
          state.btcTickers[ticker].percentChange = tickerInfo.percentChange
        }
      }
    },
    updateCurrentCandle(state, currentCandle) {
      state.currentCandle = currentCandle
    },
  },

  actions: {},

  modules: {
    initTickers,
    orderbookSnapshot,
    historicalCandlesticks,
    websocketStream,
  },
})
