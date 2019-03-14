const express = require('express')
const prom = require('prom-client')
const router = express.Router()
const datastore = require('./datastore')
const url = require('url')
const { parseUrl } = require('./utils')

router.get('/', (routerRequest, routerResponse) => {
  let parameters = parseUrl(url.parse(routerRequest.url).query)
  datastore.list(routerRequest.query.pageToken, parameters)
    .then(data => {
      routerResponse.render('index.pug', { data })
    })
    .catch(error => console.log('Rejected: ' + error))
})

router.get('/metrics', (routerRequest, routerResponse) => {
  // console.log(prom.register.metrics())
  routerResponse.end(prom.register.metrics())
})

/**
 * Errors on "/*" routes.
 */
router.use((error, routerRequest, response, next) => {
  error.response = error.message
  next(error)
})

module.exports = router
