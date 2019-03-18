const express = require('express')
const router = express.Router()
const datastore = require('./datastore')
const { IexResponseToArray, httpRetryable } = require('./utils')
const config = require('./config')

const MILLISECONDS_IN_MINUTE = 60 * 1000

router.get('/', (routerRequest, routerResponse) => {
  let data
  let iexListUrl = process.env.IEX_ENDPOINT
    + 'market/batch?symbols=' + config.symbols.join(',')
    + '&types=quote&range=' + config.priceRange + config.priceRangeDateType
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
      routerResponse.json(data)
      datastore.update(data, response)
    })
    .then(() => {
      updatePrices(routerRequest)
      setInterval(updatePrices, config.minutesForUpdate * MILLISECONDS_IN_MINUTE, routerRequest)
    })
    .catch(error => console.log('Error ' + error.status + ': ' + error))
})

function updatePrices(routerRequest) {
  let time
  let data
  Promise.all(config.symbols.map(symbol => {
    return httpRetryable(process.env.IEX_ENDPOINT + symbol + '/price')
  }))
    .then(prices => {
      time = new Date()
      data = prices.map((price, index) => {
        return {
          symbol: config.symbols[index],
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
