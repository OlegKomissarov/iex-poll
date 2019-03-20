require('dotenv').config()
const express = require('express')
const app = express()
const api = require('./src/api')

app.use('/', api)

app.use((request, response) => {
  response.status(404).send('Error 404: not found')
})

app.use((error, request, response) => {
  console.error(error)
  response.status(500).send('Error: ' + error.response)
})

const server = app.listen(process.env.PORT, () => {
  console.log('App listening on port ' + server.address().port)
})

module.exports = app
