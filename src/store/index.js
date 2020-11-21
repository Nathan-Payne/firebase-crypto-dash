import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

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
  }
  return tickerInfo
}

function sortArrayColumnDesc(a, b) {
  return b[0] - a[0]
}
function sortArrayColumnAsc(a, b) {
  return a[0] - b[0]
}

function findNewBinStart(el, binStart, precision) {
  let newBinStart
  let emptyLevels = []
  for (let i = binStart; i < 2000 * precision; i += precision) {
    if (+el[0] > i && +el[0] <= precision + i) {
      newBinStart = i
      break
    }
    emptyLevels.push([`${i}`, '0.00000000'])
  }
  return { newBinStart, emptyLevels }
}

function createBinnedOrderbook(orderbook, precision, btcPrice) {
  orderbook.sort(sortArrayColumnAsc)
  let binnedOrderbook = []
  let binTotal = 0
  // start at bin $1000 below current price
  let binStart = Math.round((btcPrice - 1000) / precision)
  for (let el of orderbook) {
    let binEnd = binStart + precision
    if (+el[0] > binStart && +el[0] <= binEnd) {
      binTotal += +el[1]
    }
    if (+el[0] > binEnd) {
      binnedOrderbook.push([`${binStart}`, `${binTotal}`])
      const { newBinStart } = findNewBinStart(el, binStart, precision)
      // binnedOrderbook.push(emptyLevels)
      binStart = newBinStart
      binTotal = +el[1]
    }
    if (orderbook[orderbook.length - 1] === el) {
      binnedOrderbook.push([`${binStart}`, `${binTotal}`])
    }
  }
  binnedOrderbook.splice(0, 1) //remove init level
  return binnedOrderbook
}

export default new Vuex.Store({
  state: {
    loaded: false,
    chartInterval: '5m',
    depthSnapshotSize: 1000,
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
    getPriceAxis: state => state.orderbookDepth.priceAxis,
    getAmountAxis: state => state.orderbookDepth.amountAxis,
    getCandlestickData: state => state.candlesticks,
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
    async callBinanceSocket({ commit, state }, { chartInterval }) {
      //https://binance-docs.github.io/apidocs/spot/en/#individual-symbol-ticker-streams for data format

      let depthSnapshot, fullOrderbook, btcPrice
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

      try {
        depthSnapshot = await axios.get(
          `https://www.binance.com/api/v3/depth?symbol=BTCUSDT&limit=${state.depthSnapshotSize}`
        )
        // static orderbook - initial state from rest api call
        const asks = depthSnapshot.data.asks.sort(sortArrayColumnDesc)
        const bids = depthSnapshot.data.bids
        fullOrderbook = [...asks, ...bids]
      } catch (err) {
        console.error(err)
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
          commit('updateTicker', tickerInfo)
          if (ticker.uppercaseName === 'BTCUSDT') {
            btcPrice = tickerInfo.lastPrice
          }
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
          let binnedOrderbook = createBinnedOrderbook(
            fullOrderbook,
            10,
            btcPrice
          )
          binnedOrderbook.sort(sortArrayColumnDesc)
          let priceAxis = binnedOrderbook.map(el => {
            return parseFloat(el[0])
          })
          let amountAxis = binnedOrderbook.map(el => {
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
        if (initialiseCount > 1 && initialiseCount < 5) {
          commit('loaded')
        }
        if (initialiseCount < 5) {
          initialiseCount++
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
