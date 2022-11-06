import request from 'superagent'
import EventBus from '@/services/EventBus'

const onError = err => {
  const error = JSON.parse(err.response.text)
  EventBus.$emit('show-error-snackbar', error)
  throw error
}
const getBody = response => response.body

const defaultRequest = request => request
  .set('Authorization', window.localStorage.token)
  .then(getBody)
  .catch(onError)

class BaseService {
  static GET (url, query) {
    return defaultRequest(request.get(url).query(query))
  }

  static POST (url, data) {
    return defaultRequest(request.post(url).send(data))
  }

  static DELETE (url) {
    return defaultRequest(request.delete(url))
  }

  static PUT (url, data) {
    return defaultRequest(request.put(url).send(data))
  }

  static PATCH (url, data) {
    return defaultRequest(request.patch(url).send(data))
  }
}

export default BaseService
