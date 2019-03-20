const express = require('express')
const router = express.Router()
const datastore = require('./datastore')
const { httpRetryable } = require('./http')
const config = require('./config')

const MILLISECONDS_IN_MINUTE = 60 * 1000

router.get('/', (routerRequest, routerResponse) => {
  let companies
  let iexListUrl = process.env.IEX_ENDPOINT
    + 'market/batch?symbols=' + config.symbols.join(',')
    + '&types=quote&range=' + config.priceRange + config.priceRangeDateType
  httpRetryable(iexListUrl)
    .then(response => {
      companies = iexResponseToArray(response)
      return Promise.all(companies.map(company => {
        let iexGetLogoUrl = process.env.IEX_ENDPOINT + company.symbol + '/logo'
        return httpRetryable(iexGetLogoUrl)
      }))
    })
    .then(logos => {
      logos.forEach((logo, index) => {
        companies[index].logo = logo.url
      })
      return datastore.list(routerRequest.query.pageToken)
    })
    .then(companiesToUpdate => {
      companies = companies.map(company => {
        let existingCompany = companiesToUpdate.find(companyToUpdate => companyToUpdate.symbol === company.symbol)
        if (existingCompany) {
          company.prices = existingCompany.prices
        }
        return company
      })
      datastore.update(datastore.toDatastoreFormat(companies, 'symbol'))
    })
    .then(() => {
      updatePrices(routerRequest)
      setInterval(updatePrices, config.minutesForUpdate * MILLISECONDS_IN_MINUTE, routerRequest)
    })
    .then(() => {
      routerResponse.json(companies)
    })
    .catch(error => console.log('Error ' + error.status + ': ' + error))
})

function updatePrices(routerRequest) {
  let prices
  Promise.all(config.symbols.map(symbol => {
    let iexGetPriceUrl = process.env.IEX_ENDPOINT + symbol + '/price'
    return httpRetryable(iexGetPriceUrl)
  }))
    .then(response => {
      prices = getPricesWithTimestamps(response)
      return datastore.list(routerRequest.query.pageToken)
    })
    .then(companies => {
      companies = setPricesToCompanies(companies, prices)
      datastore.update(datastore.toDatastoreFormat(companies, 'symbol'))
    })
    .catch(error => console.log('Error ' + error.status + ': ' + error))
}

function iexResponseToArray(response) {
  let array = []
  for (const key in response) {
    array.push({
      symbol: key,
      name: response[key].quote.companyName
    })
  }
  return array
}

function getPricesWithTimestamps(prices) {
  let currentTime = new Date()
  return prices.map((price, index) => {
    return {
      symbol: config.symbols[index],
      timestamp: currentTime,
      value: price
    }
  })
}

function setPricesToCompanies(companies, prices) {
  return companies.map(company => {
    let price = prices.find(price => price.symbol === company.symbol)
    if (!company.prices) {
      company.prices = []
    }
    if (price) {
      delete price.symbol
      company.prices.push(price)
    }
    return company
  })
}

/**
 * Errors on "/*" routes.
 */
router.use((error, routerRequest, routerResponse, next) => {
  error.response = error.message
  next(error)
})

module.exports = router
