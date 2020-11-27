import axios from 'axios'

const historicalCandlesticks = {
  actions: {
    async getCandlestickData(context, { interval }) {
      // historical candlesticks for Chart.vue
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
  mutations: {
    getCandlestickData(state, formattedCandlesticks) {
      state.candlesticks = formattedCandlesticks
    },
  },
  state: {
    candlesticks: [],
  },
  getters: {
    getCandlestickData: state => state.candlesticks,
  },
}

export default historicalCandlesticks
