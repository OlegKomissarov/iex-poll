const { Datastore } = require(process.env.DATASTORE_ENDPOINT)
const datastore = new Datastore()

const KIND = 'company'

function update(data) {
  datastore.save(data, error => {
    if (error) {
      console.log('Error: ' + error)
    }
  })
}

function list(token) {
  return new Promise((resolve, reject) => {
    const query = datastore
      .createQuery([KIND])
      .start(token)
    datastore.runQuery(query, (error, entities) => {
      if (error) {
        reject(error)
      }
      resolve(entities)
    })
  })
}

function toDatastoreFormat(data, key) {
  return data.map(element => {
    return {
      key: datastore.key([KIND, element[key]]),
      data: element
    }
  })
}

module.exports = {
  list,
  update,
  toDatastoreFormat
}
