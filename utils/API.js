const BASE_URL = `https://${__DEV__ === 'production' ? 'prod' : 'dev'}.selyt.fun`

module.exports = class API {
  static login (body) {
    return API.post('/user/login', body)
  }

  static register (body) {
    return API.post('/user/register', body)
  }

  static get (route) {
    return fetch(`${BASE_URL}${route}`)
  }

  static post (route, body) {
    return fetch(`${BASE_URL}${route}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
  }
}