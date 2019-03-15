require('dotenv').config()
const path = require('path')
const express = require('express')
const app = express()

app.disable('etag')
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.set('trust proxy', true)

app.use('/', require('./src/api'))

app.use((request, response) => {
  response.status(404).send('Not Found')
})

app.use((error, request, response) => {
  console.error(error)
  response.status(500).send(error.response || 'Something broke!')
})

if (module === require.main) {
  const server = app.listen(process.env.PORT, () => {
    const port = server.address().port
    console.log('App listening on port ' + port)
  })
}

module.exports = app
