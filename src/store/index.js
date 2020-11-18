import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

function sortNumbersDesc(a, b) {
  return b[0] - a[0]
}

export default new Vuex.Store({
  state: {
    loaded: false,
    chartInterval: '5m',
    tickers: {
      BTCUSDT: {
        pair: 'BTCUSDT',
        lastPrice: '',
        percentChange: '',
      },
      ETHUSDT: {
        pair: 'ETHUSDT',
        lastPrice: '',
        percentChange: '',
      },
    },
    orderbookDepth: {
      priceAxis: [],
      amountAxis: [],
    },
    candlesticks: [],
    currentCandle: {},
  },

  getters: {
    isLoaded: state => state.loaded,
    getChartInterval: state => state.chartInterval,
    getTickersArray: state => {
      let arr = []
      for (let ticker in state.tickers) {
        arr.push(state.tickers[ticker])
      }
      return arr
    },
    getPriceAxis: state => state.orderbookDepth.priceAxis,
    getAmountAxis: state => state.orderbookDepth.amountAxis,
    getCandlestickData: state => state.candlesticks,
    getBtcPrice: state => state.tickers.BTCUSDT.lastPrice,
    getCurrentCandle: state => state.currentCandle,
  },

  mutations: {
    loaded: state => (state.loaded = true),
    updateTicker(state, tickerInfo) {
      for (let ticker in state.tickers) {
        if (state.tickers[ticker].pair === tickerInfo.pair) {
          state.tickers[ticker].lastPrice = tickerInfo.lastPrice
          state.tickers[ticker].percentChange = tickerInfo.percentChange
        }
      }
    },
    updateDepthPrice(state, priceAxis) {
      state.orderbookDepth.priceAxis = priceAxis.dataArr
    },
    updateDepthAmount(state, amountAxis) {
      state.orderbookDepth.amountAxis = amountAxis.dataArr
    },
    getCandlestickData(state, formattedCandlesticks) {
      state.candlesticks = formattedCandlesticks
    },
    updateCurrentCandle(state, currentCandle) {
      state.currentCandle = currentCandle
    },
  },

  actions: {
    async callBinanceSocket({ commit }, { chartInterval }) {
      //https://binance-docs.github.io/apidocs/spot/en/#individual-symbol-ticker-streams for data format
      let tickerInfo = {
        pair: '',
        lastPrice: '',
        percentChange: '',
      }
      let depthSnapshot, fullOrderbook
      try {
        depthSnapshot = await axios.get(
          'https://www.binance.com/api/v3/depth?symbol=BTCUSDT&limit=1000'
        )
        // static orderbook - initial state from rest api call
        const asks = depthSnapshot.data.asks.sort(sortNumbersDesc)
        const bids = depthSnapshot.data.bids
        fullOrderbook = [...asks, ...bids]
      } catch (err) {
        console.error(err)
      }
      let count = 0

      const socket = await new WebSocket(
        `wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker/btcusdt@depth20/btcusdt@depth/btcusdt@kline_${chartInterval}`
      )
      socket.onmessage = event => {
        const parsedData = JSON.parse(event.data)
        if (parsedData.stream == 'btcusdt@ticker') {
          tickerInfo = {
            pair: 'BTCUSDT',
            lastPrice: parseFloat(parsedData.data.c).toFixed(2),
            percentChange: parseFloat(parsedData.data.P).toFixed(2),
          }
          commit('updateTicker', tickerInfo)
        }
        if (parsedData.stream == 'ethusdt@ticker') {
          tickerInfo = {
            pair: 'ETHUSDT',
            lastPrice: parseFloat(parsedData.data.c).toFixed(2),
            percentChange: parseFloat(parsedData.data.P).toFixed(2),
          }
          commit('updateTicker', tickerInfo)
        }
        // LIVE ORDERBOOK DATA THROUGH WEBSOCKET - ONLY FIRST 20 LEVELS
        // if (parsedData.stream == 'btcusdt@depth20') {
        //   const asks = parsedData.data.asks.sort(sortNumbersDesc)
        //   const bids = parsedData.data.bids
        //   const orderedBookArr = [...asks, ...bids]
        //   let priceAxis = orderedBookArr.map(el => {
        //     return parseFloat(el[0])
        //   })
        //   let amountAxis = orderedBookArr.map(el => {
        //     return parseFloat(el[1])
        //   })
        //   commit({
        //     type: 'updateDepthPrice',
        //     dataArr: priceAxis,
        //   })
        //   commit({
        //     type: 'updateDepthAmount',
        //     dataArr: amountAxis,
        //   })
        // }
        if (parsedData.stream == 'btcusdt@depth') {
          let orderbookChanges = [...parsedData.data.a, ...parsedData.data.b]
          // ensure data recorded by websocket before REST API doesn't affect orderbook
          if (parsedData.data.u > depthSnapshot.data.lastUpdateId) {
            // loop over orderbookChanges, use change[0] to find matching price in fullOrderbook
            orderbookChanges.forEach(change => {
              let foundLevelIndex = fullOrderbook.findIndex(
                level => level[0] === change[0]
              )
              // if found: replace matchedPrice[1] with change[1];
              // if not found: add new pricelevel to fullOrderbook
              if (foundLevelIndex !== -1 && change[1] === '0.00000000') {
                fullOrderbook.splice(foundLevelIndex, 1)
              } else if (foundLevelIndex !== -1 && change[1] !== '0.00000000') {
                fullOrderbook[foundLevelIndex][1] = change[1]
              } else {
                fullOrderbook.push(change)
              }
            })
            // sort orderbook
            fullOrderbook.sort(sortNumbersDesc)
          }

          let priceAxis = fullOrderbook.map(el => {
            return parseFloat(el[0])
          })
          let amountAxis = fullOrderbook.map(el => {
            return parseFloat(el[1])
          })
          commit({
            type: 'updateDepthPrice',
            dataArr: priceAxis,
          })
          commit({
            type: 'updateDepthAmount',
            dataArr: amountAxis,
          })
        }
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
        //ensure data fully loaded and streaming
        if (count > 1 && count < 5) {
          commit('loaded')
        }
        if (count < 5) {
          count++
        }
      }
    },
    async getCandlestickData(context, { interval }) {
      let response
      try {
        response = await axios.get(
          `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=${interval}`
        )
      } catch (err) {
        console.error(err)
      }
      const formattedCandlesticks = response.data.map(stick => {
        return {
          time: parseFloat(stick[0]) / 1000,
          open: parseFloat(stick[1]),
          high: parseFloat(stick[2]),
          low: parseFloat(stick[3]),
          close: parseFloat(stick[4]),
          volume: parseFloat(stick[5]),
        }
      })
      context.commit('getCandlestickData', formattedCandlesticks)
    },
  },

  modules: {},
})
