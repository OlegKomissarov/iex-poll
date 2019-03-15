const { Datastore } = require(process.env.DATASTORE_ENDPOINT)
const datastore = new Datastore()
const kind = 'company1'

function update(data, existingData) {
  let entities = data.map(entity => {
    let ex = existingData.find(element => element.symbol === entity.symbol)
    entity.prices = ex && ex.prices
    return {
      key: datastore.key([kind, entity.symbol]),
      data: entity
    }
  })
  datastore.save(entities, error => {
    if (error) {
      console.log('Error occurred: ' + error)
    }
  })
}

function updatePrices(data, existingData) {
  let entities = existingData.map(entity => {
    let priceEntity = data.find(price => price.symbol === entity.symbol)
    if (!entity.prices) {
      entity.prices = []
    }
    if (priceEntity) {
      entity.prices.push({
        value: priceEntity.value,
        timestamp: priceEntity.timestamp
      })
    }
    return {
      key: datastore.key([kind, entity.symbol]),
      data: entity
    }
  })
  datastore.save(entities, error => {
    if (error) {
      console.log('Error occurred: ' + error)
    }
  })
}

function list(token) {
  return new Promise((resolve, reject) => {
    const query = datastore
      .createQuery([kind])
      .start(token)
    datastore.runQuery(query, (error, entities) => {
      if (error) {
        reject(error)
      }
      resolve(entities)
    })
  })
}

module.exports = {
  list,
  update,
  updatePrices
}
