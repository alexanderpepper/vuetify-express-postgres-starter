import request from 'superagent'

class BaseService {
  static GET (url, query) {
    return request.get(url)
      .query(query)
      .set('Authorization', window.localStorage.token)
      .then(response => response.body)
      .catch(err => {
        throw JSON.parse(err.response.text)
      })
  }

  static POST (url, data) {
    return request.post(url)
      .send(data)
      .set('Authorization', window.localStorage.token)
      .then(response => response.body)
      .catch(err => {
        throw JSON.parse(err.response.text)
      })
  }

  static DELETE (url) {
    return request.delete(url)
      .set('Authorization', window.localStorage.token)
      .then(response => response.body)
      .catch(err => {
        throw JSON.parse(err.response.text)
      })
  }

  static PUT (url, data) {
    return request.put(url)
      .send(data)
      .set('Authorization', window.localStorage.token)
      .then(response => response.body)
      .catch(err => {
        throw JSON.parse(err.response.text)
      })
  }

  static PATCH (url, data) {
    return request.patch(url)
      .send(data)
      .set('Authorization', window.localStorage.token)
      .then(response => response.body)
      .catch(err => {
        throw JSON.parse(err.response.text)
      })
  }
}

export default BaseService
