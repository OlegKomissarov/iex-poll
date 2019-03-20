const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest

const MAX_RETRIES = 3
const TIMEOUT_BEFORE_RETRY = 2500

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
            console.log('retrying failed request...')
            httpRetryable(url, retries)
              .then(resolve)
          }, TIMEOUT_BEFORE_RETRY)
        }
      })
  })
}

module.exports = {
  httpRetryable
}
