import tickerUpdater from '../../utils/tickerUpdater'
import { sortArrayColumnDesc } from '../../utils/sorting'
import {
  createBinnedOrderbook,
  updateBinnedOrderbook,
} from '../../utils/orderbook'

export default {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async callBinanceSocket(
      { commit, dispatch, rootState, rootGetters },
      { chartInterval }
    ) {
      let initialiseCount = 0
      let allRequestedTickers = [
        ...rootState.allUsdtTickers,
        ...rootState.allBtcTickers,
      ]

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
        })

        if (parsedData.stream == 'btcusdt@depth') {
          // REALTIME ORDERBOOK UPDATE
          let orderbookChangesArr = [...parsedData.data.a, ...parsedData.data.b]
          // ensure data recorded by websocket before REST API doesn't affect orderbook
          if (parsedData.data.u > rootState.orderbookSnapshot.depthSnapshotId) {
            let orderbookObj = rootState.orderbookSnapshot.orderbookObj

            let orderbookChanges = orderbookChangesArr.reduce(
              (obj, [level, price]) => {
                obj[level] = +price
                return obj
              },
              {}
            )

            for (let level in orderbookChanges) {
              if (
                level > rootGetters.getBtcPrice + 1000 ||
                level < rootGetters.getBtcPrice - 1000
              ) {
                continue // skip iteration if level outside shown price range
              } else if (level in orderbookObj) {
                // level IN orderbook
                if (orderbookChanges[level] === 0.0) {
                  delete orderbookObj[level] // remove level if 0
                } else {
                  orderbookObj[level] = orderbookChanges[level] // replace level value
                }
              } else {
                // level NOT in orderbook
                if (orderbookChanges[level] === 0.0) {
                  continue // edge case of 0 values being added to previous undefined levels
                } else {
                  orderbookObj[level] = orderbookChanges[level]
                }
              }
            }

            const initBinnedOrderbookObj = createBinnedOrderbook(
              rootState.orderbookSnapshot.orderbookBinSize,
              rootGetters.getBtcPrice
            )

            let updatedBinnedOrderbookObj = updateBinnedOrderbook(
              orderbookObj,
              initBinnedOrderbookObj,
              rootState.orderbookSnapshot.orderbookBinSize
            )

            // conversion back to array format for graph library
            let binnedOrderbookArr = Object.entries(updatedBinnedOrderbookObj) // returns [[key, val], [key, val], ...]
            binnedOrderbookArr.sort(sortArrayColumnDesc)

            let priceAxis = binnedOrderbookArr.map(level => {
              return parseFloat(level[0])
            })
            let amountAxis = binnedOrderbookArr.map(level => {
              return parseFloat(level[1])
            })
            commit({
              type: 'updateDepthPrice',
              payload: priceAxis,
            })
            commit({
              type: 'updateDepthAmount',
              payload: amountAxis,
            })
          }
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
        if (initialiseCount > 1 && initialiseCount < 3) {
          commit('loaded')
          dispatch('getOrderbookSnapshot')
        }
        if (initialiseCount < 3) {
          initialiseCount++
        }
      }
    },
  },
}
