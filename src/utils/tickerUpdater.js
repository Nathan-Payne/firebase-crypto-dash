export default function tickerUpdater(urlName, uppercaseName, parsedData) {
  let tickerInfo = {
    pair: '',
    lastPrice: '',
    percentChange: '',
  }
  if (parsedData.stream == `${urlName}@ticker`) {
    tickerInfo = {
      pair: uppercaseName,
      lastPrice: parseFloat(parsedData.data.c).toFixed(8),
      percentChange: parseFloat(parsedData.data.P).toFixed(2),
    }
  } else {
    return
  }
  return tickerInfo
}
