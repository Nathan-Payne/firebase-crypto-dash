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
      state.orderbookDepth.priceAxis = priceAxis.dataArr
    },
    updateDepthAmount(state, amountAxis) {
      state.orderbookDepth.amountAxis = amountAxis.dataArr
    },
  },

  actions: {
    async getOrderbookSnapshot({ commit, state, rootGetters }) {
      let fullOrderbook
      try {
        const depthSnapshot = await axios.get(
          `https://www.binance.com/api/v3/depth?symbol=BTCUSDT&limit=${state.depthSnapshotSize}`
        )
        // static orderbook - initial state from rest api call
        const asks = depthSnapshot.data.asks.sort(sortArrayColumnDesc)
        const bids = depthSnapshot.data.bids
        fullOrderbook = [...asks, ...bids]
      } catch (err) {
        console.error(err)
      }

      let binnedOrderbook = createBinnedOrderbook(
        fullOrderbook,
        10,
        rootGetters.getBtcPrice
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
    },
  },
}

export default orderbookSnapshot
