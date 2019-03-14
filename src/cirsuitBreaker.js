const { httpGet } = require('./utils')

class CircuitBreaker {
  constructor(failureThreshold, retryTimePeriod) {
    this.state = 'CLOSED'
    this.failureThreshold = failureThreshold
    this.retryTimePeriod = retryTimePeriod
    this.lastFailureTime = null
    this.failureCount = 0
  }
  call(urlToCall) {
    this.setState()
    switch (this.state) {
      case 'OPEN':
        return null
      case 'HALF-OPEN':
      case 'CLOSED':
        return httpGet(urlToCall)
          .then(response => {
            this.reset()
            return response
          })
          .catch(error => {
            this.recordFailure()
            console.log('Failed to connect to', urlToCall, 'error', error.code || error)
          })
    }
  }
  reset() {
    this.failureCount = 0
    this.lastFailureTime = null
    this.state = 'CLOSED'
  }
  setState() {
    console.log(this.failureCount)
    if (this.failureCount > this.failureThreshold) {
      if ((Date.now() - this.lastFailureTime) > this.retryTimePeriod) {
        this.state = 'HALF-OPEN'
      } else {
        this.state = 'OPEN'
      }
    } else {
      this.state = 'CLOSED'
    }
  }
  recordFailure() {
    this.failureCount++
    this.lastFailureTime = Date.now()
  }
}

module.exports = {
  CircuitBreaker
}
