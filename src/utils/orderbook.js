import { sortArrayColumnAsc } from '../utils/sorting'

function findNewBinStart(el, binStart, precision) {
  let newBinStart
  let emptyLevels = []
  for (let i = binStart; i < binStart + 100 * precision; i += precision) {
    if (+el[0] > i && +el[0] <= precision + i) {
      newBinStart = i
      break
    }
    emptyLevels.push([`${i}`, '0.00000000'])
  }
  return { newBinStart, emptyLevels }
}

export function createBinnedOrderbook(orderbook, precision, btcPrice) {
  orderbook.sort(sortArrayColumnAsc) // expects ordered array ascending for now
  let binnedOrderbook = []
  let binTotal = 0
  let binStart = Math.round((btcPrice - 500) / precision) * precision // start at bin $500 below current price
  for (let el of orderbook) {
    let binEnd = binStart + precision
    // console.log('in function: ', binStart, binEnd, +el[0])
    if (+el[0] > binStart && +el[0] <= binEnd) {
      // if orderbook level in range set then add value to total
      binTotal += +el[1]
    }
    if (+el[0] > binEnd) {
      // if level out of range add total to returned array and find next range with a value
      binnedOrderbook.push([`${binStart}`, `${binTotal}`])
      const { newBinStart } = findNewBinStart(el, binStart, precision)
      // binnedOrderbook.push(emptyLevels)
      binStart = newBinStart
      binTotal = +el[1]
    }
    if (orderbook[orderbook.length - 1] === el) {
      // if at final level add remaining to final summed range
      binnedOrderbook.push([`${binStart}`, `${binTotal}`])
    }
  }
  // binnedOrderbook.splice(0, 1) //remove init level
  return binnedOrderbook
}
