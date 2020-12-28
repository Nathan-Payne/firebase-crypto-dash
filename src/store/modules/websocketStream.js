import tickerUpdater from '../../utils/tickerUpdater'

export default {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async callBinanceSocket(
      { commit, dispatch, rootState },
      { chartInterval }
    ) {
      //https://binance-docs.github.io/apidocs/spot/en/#individual-symbol-ticker-streams for data format
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
