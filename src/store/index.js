import Vue from 'vue'
import Vuex from 'vuex'
import historicalCandlesticks from './modules/historicalCandlesticks'
import orderbookSnapshot from './modules/orderbook'

Vue.use(Vuex)

function tickerUpdater(urlName, uppercaseName, parsedData) {
  let tickerInfo = {
    pair: '',
    lastPrice: '',
    percentChange: '',
  }
  if (parsedData.stream == `${urlName}@ticker`) {
    tickerInfo = {
      pair: uppercaseName,
      lastPrice: parseFloat(parsedData.data.c).toFixed(8),
      percentChange: parseFloat(parsedData.data.P).toFixed(2),
    }
  } else {
    return
  }
  return tickerInfo
}

export default new Vuex.Store({
  state: {
    loaded: false,
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
    createUsdtTicker(state, initTicker) {
      state.usdtTickers[initTicker.pair] = initTicker
    },
    createBtcTicker(state, initTicker) {
      state.btcTickers[initTicker.pair] = initTicker
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

  actions: {
    async callBinanceSocket({ commit, state }, { chartInterval }) {
      //https://binance-docs.github.io/apidocs/spot/en/#individual-symbol-ticker-streams for data format
      let initialiseCount = 0
      let requestedUsdtTickers = state.allUsdtTickers
      let requestedBtcTickers = state.allBtcTickers
      let allRequestedTickers = [
        ...state.allUsdtTickers,
        ...state.allBtcTickers,
      ]

      // add new ticker names to the websocket url and state.allTickers
      for (let ticker of requestedUsdtTickers) {
        let initTicker = {
          pair: ticker.uppercaseName,
          lastPrice: '',
          percentChange: '',
        }
        commit('createUsdtTicker', initTicker)
      }
      for (let ticker of requestedBtcTickers) {
        let initTicker = {
          pair: ticker.uppercaseName,
          lastPrice: '',
          percentChange: '',
        }
        commit('createBtcTicker', initTicker)
      }

      const socket = await new WebSocket(
        `wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker/linkusdt@ticker/adausdt@ticker/btcbtc@ticker/ethbtc@ticker/linkbtc@ticker/adabtc@ticker/btcusdt@depth/btcusdt@kline_${chartInterval}`
      )

      socket.onmessage = event => {
        const parsedData = JSON.parse(event.data)
        allRequestedTickers.forEach(ticker => {
          let tickerInfo = tickerUpdater(
            ticker.urlName,
            ticker.uppercaseName,
            parsedData
          )
          if (typeof tickerInfo !== 'undefined') {
            commit('updateTicker', tickerInfo)
          }
          // if (ticker.uppercaseName === 'BTCUSDT') {
          //   btcPrice = tickerInfo.lastPrice
          // }
        })

        if (parsedData.stream == 'btcusdt@depth') {
          // REALTIME ORDERBOOK DATA UPDATE
          // let orderbookChanges = [...parsedData.data.a, ...parsedData.data.b]
          // // ensure data recorded by websocket before REST API doesn't affect orderbook
          // // if (parsedData.data.u > depthSnapshot.data.lastUpdateId) {
          // //   // loop over orderbookChanges, use change[0] ('price') to find matching price in fullOrderbook
          // //   orderbookChanges.forEach(change => {
          // //     let foundLevelIndex = fullOrderbook.findIndex(
          // //       level => level[0] === change[0]
          // //     )
          // //     // limiting number of levels processed
          // //     // if (+change[0] > btcPrice + 1000) {
          // //     //   console.log('outside', +change[0])
          // //     // }
          // //     // if (+change[0] < btcPrice - 1000) {
          // //     //   console.log('outside below', +change[0])
          // //     // }
          // //     // if found: replace matchedPrice[1] ('amount) with change[1];
          // //     // if not found: add new pricelevel to fullOrderbook
          // //     // if (foundLevelIndex !== -1 && change[1] === '0.00000000') {
          // //     //   fullOrderbook.splice(foundLevelIndex, 1)
          // //     // }
          // //     if (foundLevelIndex !== -1 && change[1] !== '0.00000000') {
          // //       fullOrderbook[foundLevelIndex][1] = change[1]
          // //     } else {
          // //       fullOrderbook.push(change)
          // //     }
          // //   })
          // //   //fullOrderbook.sort(sortArrayColumnAsc)
          // // }
        }
        // Live candlestick data for current candle
        if (parsedData.stream == `btcusdt@kline_${chartInterval}`) {
          const candle = parsedData.data.k
          const currentCandle = {
            time: parseFloat(candle.t) / 1000,
            open: parseFloat(candle.o),
            high: parseFloat(candle.h),
            low: parseFloat(candle.l),
            close: parseFloat(candle.c),
          }
          commit('updateCurrentCandle', currentCandle)
        }

        //ensure data fully loaded and streaming before chart initialisation
        if (initialiseCount > 1 && initialiseCount < 5) {
          commit('loaded')
        }
        if (initialiseCount < 5) {
          initialiseCount++
        }
      }
    },
  },

  modules: {
    orderbookSnapshot,
    historicalCandlesticks,
  },
})
