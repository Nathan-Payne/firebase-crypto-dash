const initTickers = {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    initTickers({ commit, rootState }) {
      let requestedUsdtTickers = rootState.allUsdtTickers
      let requestedBtcTickers = rootState.allBtcTickers

      // add new ticker names to rootState.allTickers
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
    },
  },
}

export default initTickers
