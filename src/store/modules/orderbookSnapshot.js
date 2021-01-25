import axios from 'axios'
import { sortArrayColumnDesc } from '../../utils/sorting'
import {
  createBinnedOrderbook,
  updateBinnedOrderbook,
} from '../../utils/orderbook'

const orderbookSnapshot = {
  state: {
    depthSnapshotSize: 5000,
    orderbookBinSize: 20,
    depthSnapshotId: null,
    orderbookObj: {},
    initBinnedOrderbookObj: {},
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
    storeDepthSnapshotId(state, depthSnapshotId) {
      state.depthSnapshotId = depthSnapshotId.payload
    },
    storeOrderbookObj(state, orderbookObj) {
      state.orderbookObj = orderbookObj.payload
    },
    storeInitBinnedOrderbookObj(state, binnedOrderbookObj) {
      state.initBinnedOrderbookObj = binnedOrderbookObj.payload
    },
  },

  actions: {
    async getOrderbookSnapshot({ commit, state, rootGetters }) {
      let fullOrderbookArray
      let orderbookObj
      const orderbookBinSize = state.orderbookBinSize

      try {
        const depthSnapshot = await axios.get(
          `https://www.binance.com/api/v3/depth?symbol=BTCUSDT&limit=${state.depthSnapshotSize}`
        )
        commit({
          type: 'storeDepthSnapshotId',
          payload: depthSnapshot.data.lastUpdateId,
        })

        const asks = depthSnapshot.data.asks
        const bids = depthSnapshot.data.bids
        fullOrderbookArray = [...asks, ...bids]

        // create orderbook object (efficient live lookup) and store for websocke reference
        orderbookObj = fullOrderbookArray.reduce((obj, [level, price]) => {
          obj[level] = +price
          return obj
        }, {})
      } catch (err) {
        console.error(err)
      }
      commit({ type: 'storeOrderbookObj', payload: orderbookObj })

      // create initial bins to be populated
      let initBinnedOrderbookObj = createBinnedOrderbook(
        orderbookBinSize,
        rootGetters.getBtcPrice
      )
      commit({
        type: 'storeInitBinnedOrderbookObj',
        payload: initBinnedOrderbookObj,
      })

      // aggregate levels into bins for display
      const binnedOrderbookObj = updateBinnedOrderbook(
        orderbookObj,
        initBinnedOrderbookObj,
        orderbookBinSize
      )

      // conversion back to array format for graph library
      let binnedOrderbookArr = Object.entries(binnedOrderbookObj) // returns [[key, val], [key, val], ...]
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
    },
  },
}

export default orderbookSnapshot
