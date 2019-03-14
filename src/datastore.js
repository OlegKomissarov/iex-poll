const { Datastore } = require(process.env.DATASTORE_ENDPOINT)
const datastore = new Datastore()
const kind = 'company1'

function list(token, parameters) {
  return new Promise((resolve, reject) => {
    // TODO: refactor queries
    // TODO: think about moving prices array to another table
    const query = datastore.createQuery([kind])
    if (parameters.symbol) {
      // `IN` operators are currently not supported in filter function.
      // So, you can search only by one symbol now.
      query.filter('symbol', parameters.symbol)
    }
    query.start(token)
    datastore.runQuery(query, (error, entities) => {
      if (error) {
        reject(error)
      }
      // TODO: move date filter to the query
      let startDate
      let endDate
      if (parameters.startDate) {
        startDate = new Date(parameters.startDate)
      }
      if (parameters.endDate) {
        endDate = new Date(parameters.endDate)
        endDate.setDate(endDate.getDate() + 1)
      }
      if (startDate || endDate) {
        entities = entities.map(entity => {
          entity.prices = entity.prices.filter(price => {
            return (!startDate || new Date(price.timestamp) >= startDate)
                && (!endDate || new Date(price.timestamp) <= endDate)
          })
          return entity
        })
      }
      resolve(entities)
    })
  })
}

module.exports = { list }
