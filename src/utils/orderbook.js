export function createBinnedOrderbook(orderbook, binSize, btcPrice) {
  let binStart = Math.round((btcPrice - 500) / binSize) * binSize // start at bin $500 below current price
  let binnedOrderbook = {}
  for (let i = binStart; i < binStart + 1000; i += binSize) {
    binnedOrderbook[i] = 0
  }

  for (let level in orderbook) {
    for (let binnedLevel in binnedOrderbook) {
      // if orderbook level in range of key to key+binSize then add to value
      if (+level >= +binnedLevel && +level < +binnedLevel + binSize) {
        binnedOrderbook[binnedLevel] += +orderbook[level]
        break
      }
    }
  }
  return binnedOrderbook
}

// function findNewBinStart(el, binStart, precision) {
//   let newBinStart
//   let emptyLevels = []
//   for (let i = binStart; i < binStart + 100 * precision; i += precision) {
//     if (+el[0] > i && +el[0] <= precision + i) {
//       newBinStart = i
//       break
//     }
//     emptyLevels.push([`${i}`, '0.00000000'])
//   }
//   return { newBinStart, emptyLevels }
// }

// export function createBinnedOrderbook(orderbook, binSize, btcPrice) {
//   orderbook.sort(sortArrayColumnAsc) // expects ordered array ascending for now
//   let binnedOrderbook = []
//   let binTotal = 0
//   let binStart = Math.round((btcPrice - 500) / binSize) * binSize // start at bin $500 below current price
//   for (let el of orderbook) {
//     let binEnd = binStart + binSize
//     if (+el[0] > binStart && +el[0] <= binEnd) {
//       // if orderbook level in range set then add value to total
//       binTotal += +el[1]
//     }
//     if (+el[0] > binEnd) {
//       // if level out of range add total to returned array and find next range with a value
//       binnedOrderbook.push([`${binStart}`, `${binTotal}`])
//       const { newBinStart } = findNewBinStart(el, binStart, binSize)
//       // binnedOrderbook.push(emptyLevels)
//       binStart = newBinStart
//       binTotal = +el[1]
//     }
//     if (orderbook[orderbook.length - 1] === el) {
//       // if at final level add remaining to final summed range
//       binnedOrderbook.push([`${binStart}`, `${binTotal}`])
//     }
//   }
//   return binnedOrderbook
// }
