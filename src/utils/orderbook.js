export function createBinnedOrderbook(binSize, btcPrice) {
  let binStart = Math.round((btcPrice - 500) / binSize) * binSize // start at bin $500 below current price
  let binnedOrderbook = {}
  for (let i = binStart; i < binStart + 1000; i += binSize) {
    binnedOrderbook[i] = 0
  }
  return binnedOrderbook
}

export function updateBinnedOrderbook(orderbook, binnedOrderbook, binSize) {
  for (let level in orderbook) {
    for (let binnedLevel in binnedOrderbook) {
      // if orderbook level in range of key to key+binSize then add to value
      if (+level >= +binnedLevel && +level < +binnedLevel + binSize) {
        // console.log(+binnedLevel)
        binnedOrderbook[binnedLevel] += +orderbook[level]
        continue
      }
    }
  }
  return binnedOrderbook
}
