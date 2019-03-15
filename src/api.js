const express = require('express')
const router = express.Router()
const datastore = require('./datastore')
const { IexResponseToArray, httpRetryable } = require('./utils')

// TODO: get symbols from any request. Refactor this hard-code
const SYMBOLS = ['A', 'AAON', 'ABCB', 'AAN', 'AAME', 'AADR', 'AAPL']
const PRICE_UPDATE_RANGE = 1
const PRICE_UPDATE_RANGE_DATE_TYPE = 'm'
const MINUTES_FOR_UPDATE = 1
const MILLISECONDS_IN_MINUTE = 60 * 1000

router.get('/', (routerRequest, routerResponse) => {
  let data
  let iexListUrl = process.env.IEX_ENDPOINT
      + 'market/batch?symbols='
      + SYMBOLS.join(',')
      + '&types=quote&range='
      + PRICE_UPDATE_RANGE
      + PRICE_UPDATE_RANGE_DATE_TYPE
  httpRetryable(iexListUrl)
    .then(response => {
      data = IexResponseToArray(response)
      return Promise.all(data.map(entity => {
        return httpRetryable(process.env.IEX_ENDPOINT + entity.symbol + '/logo')
      }))
    })
    .then(logos => {
      logos.forEach((entity, index) => {
        data[index].logo = entity.url
      })
      return datastore.list(routerRequest.query.pageToken)
    })
    .then(response => {
      routerResponse.render('index.pug', { data })
      datastore.update(data, response)
    })
    .then(() => {
      updatePrices(routerRequest)
      setInterval(updatePrices, MINUTES_FOR_UPDATE * MILLISECONDS_IN_MINUTE, routerRequest)
    })
    .catch(error => console.log('Error ' + error.status + ': ' + error))
})

function updatePrices(routerRequest) {
  let time
  let data
  Promise.all(SYMBOLS.map(symbol => {
    return httpRetryable(process.env.IEX_ENDPOINT + symbol + '/price')
  }))
    .then(prices => {
      time = new Date()
      data = prices.map((price, index) => {
        return {
          symbol: SYMBOLS[index],
          timestamp: time,
          value: price
        }
      })
      return datastore.list(routerRequest.query.pageToken)
    })
    .then(response => {
      datastore.updatePrices(data, response)
    })
    .catch(error => console.log('Error ' + error.status + ': ' + error))
}

/**
 * Errors on "/*" routes.
 */
router.use((error, routerRequest, routerResponse, next) => {
  error.response = error.message
  next(error)
})

module.exports = router
