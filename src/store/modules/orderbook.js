import axios from 'axios'
import { sortArrayColumnDesc } from '../../utils/sorting'
import { createBinnedOrderbook } from '../../utils/orderbook'

const orderbookSnapshot = {
  state: {
    depthSnapshotSize: 5000,
    orderbookDepth: {
      priceAxis: [],
      amountAxis: [],
    },
  },

  getters: {
    getPriceAxis: state => state.orderbookDepth.priceAxis,
    getAmountAxis: state => state.orderbookDepth.amountAxis,
  },

  mutations: {
    updateDepthPrice(state, priceAxis) {
      state.orderbookDepth.priceAxis = priceAxis.payload
    },
    updateDepthAmount(state, amountAxis) {
      state.orderbookDepth.amountAxis = amountAxis.payload
    },
  },

  actions: {
    async getOrderbookSnapshot({ commit, state, rootGetters }) {
      let fullOrderbookArray
      let orderbookObject
      const orderbookBinSize = 20
      try {
        const depthSnapshot = await axios.get(
          `https://www.binance.com/api/v3/depth?symbol=BTCUSDT&limit=${state.depthSnapshotSize}`
        )
        // static orderbook - initial state from rest api call
        const asks = depthSnapshot.data.asks
        const bids = depthSnapshot.data.bids
        fullOrderbookArray = [...asks, ...bids]
        orderbookObject = fullOrderbookArray.reduce((obj, [level, price]) => {
          obj[level] = +price
          return obj
        }, {})
      } catch (err) {
        console.error(err)
      }
      let binnedOrderbookObj = createBinnedOrderbook(
        orderbookObject,
        orderbookBinSize,
        rootGetters.getBtcPrice
      )

      let binnedOrderbookArr = Object.entries(binnedOrderbookObj) // returns [[key, val], [key, val], ...]
      binnedOrderbookArr.sort(sortArrayColumnDesc)

      let priceAxis = binnedOrderbookArr.map(el => {
        return parseFloat(el[0])
      })
      let amountAxis = binnedOrderbookArr.map(el => {
        return parseFloat(el[1])
      })
      commit({
        type: 'updateDepthPrice',
        payload: priceAxis,
      })
      commit({
        type: 'updateDepthAmount',
        payload: amountAxis,
      })
    },
  },
}

export default orderbookSnapshot
