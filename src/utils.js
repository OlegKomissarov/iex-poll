const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest

function httpGet(url) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText))
      } else {
        let error = new Error(xhr.statusText)
        error.code = xhr.status
        reject(error)
      }
    }
    xhr.onerror = error => {
      reject(new Error(error))
    }
    xhr.send()
  })
}

function IexResponseToArray(object) {
  let array = []
  for (const key in object) {
    array.push({
      symbol: key,
      name: object[key].quote.companyName
    })
  }
  return array
}

module.exports = {
  httpGet,
  IexResponseToArray
}
