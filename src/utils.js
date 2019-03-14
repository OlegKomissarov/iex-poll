function parseUrl(search) {
  if (!search || !search.length) {
    return {}
  }
  let hashes = search.slice(search.indexOf('?') + 1).split('&')
  let params = {}
  hashes.map(hash => {
    let [key, val] = hash.split('=')
    params[key] = decodeURIComponent(val)
  })
  return params
}

module.exports = { parseUrl }
