const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
const MAX_RETRIES = 3

function httpGet(url) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText))
      } else {
        let error = new Error(xhr.statusText || xhr.responseText)
        error.status = xhr.status
        reject(error)
      }
    }
    xhr.onerror = error => {
      reject(new Error(error))
    }
    xhr.send()
  })
}

function httpRetryable(url, retries = 0) {
  return new Promise((resolve) => {
    httpGet(url)
      .then(resolve)
      .catch(() => {
        if(retries++ === MAX_RETRIES) {
          console.log('maximum retries exceeded')
        } else {
          setTimeout(() => {
            console.log('retrying failed promise...', retries)
            httpRetryable(url, retries)
              .then(resolve)
          }, 2500)
        }
      })
  });
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
  IexResponseToArray,
  httpRetryable
}
