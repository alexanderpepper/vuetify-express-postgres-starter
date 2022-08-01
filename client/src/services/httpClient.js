import api from '../constants/api'
import Eventbus from '../services/EventBus'
import EventBus from '../services/EventBus'

const ANY_NUMBER = '(\\d+)'

export default {
  blockingRequests: [
    api.signIn
  ].map(url => new RegExp(url)),
  ajaxCount: 0,
  requests: [],
  abort () {
    this.requests.forEach(request => request.abort())
  },
  ajaxCountChangedListeners: [],
  hasAjaxInProgress () {
    return this.ajaxCount > 0
  },
  hasBlockingAjaxInProgress () {
    return this.requests.find(request =>
      this.blockingRequests.find(urlRegex =>
        urlRegex.test(request.url)))
  },
  incrementAjaxCount () {
    this.ajaxCount++
    this.ajaxCountChangedListeners.forEach(callback => callback(this.ajaxCount))
  },
  decrementAjaxCount (request) {
    this.ajaxCount--
    if (request) {
      this.requests.splice(this.requests.indexOf(request), 1)
    }
    this.ajaxCountChangedListeners.forEach(callback => callback(this.ajaxCount))
  },
  get (url, query) {
    this.incrementAjaxCount()
    let request

    return new Promise((resolve, reject) => {
      request = this.abortableFetch(this.getUrl(url, query))
      request.ready
        .then(response => this.handleResponse(response, resolve, reject))
        .catch(err => {
          if (err.code === 20) {
            resolve([])
          } else {
            reject(err)
          }
        })
      this.requests.push(request)
    }).finally(() => {
      this.decrementAjaxCount(request)
    })
  },
  post: function (url, data, query) {
    const token = window.localStorage.token
    const headers = (data instanceof FormData)
      ? new Headers({ Authorization: `Bearer ${token}` })
      : new Headers({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' })
    const body = (data instanceof FormData) ? data : JSON.stringify(data)

    this.incrementAjaxCount()
    return new Promise((resolve, reject) => {
      return fetch(this.getUrl(url, query), { method: 'POST', body, headers })
        .then(response => this.handleResponse(response, resolve, reject))
    }).finally(() => {
      this.decrementAjaxCount()
    })
  },
  download (url, query, filename, isPost = false) {
    return new Promise((resolve, reject) => {
      const token = window.localStorage.token
      const headers = new Headers({ Authorization: `Bearer ${token}` })
      const method = isPost ? 'POST' : 'GET'

      this.incrementAjaxCount()
      return new Promise((resolve, reject) => {
        return fetch(this.getUrl(url, query), { method, headers })
          .then(response => response.blob())
          .then(blob => {
            this.openFileFromResponse(blob, filename)
            resolve()
          })
          .catch(error => {
            EventBus.$emit('show-alert', ['Error', error])
            reject(error)
          })
          .finally(() => this.decrementAjaxCount())
      })
    })
  },
  handleResponse (response, resolve, reject) {
    if (response.status === 401) {
      if (window.location.href.indexOf('login') === -1) {
        EventBus.$emit('push-route', { name: 'Login', query: { notAuthenticated: true } })
      }
      reject()
    } else if (response.ok) {
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.indexOf('application/json') !== -1) {
        resolve(response.json())
      } else {
        resolve(response.text())
      }
    } else {
      response.text().then(text => {
        reject(text)
        EventBus.$emit('show-alert', ['Error', text])
      })
    }
  },
  uploadFile (url, data, query) {
    const formData = new FormData()
    Object.keys(data).forEach(key => formData.append(key, data[key]))
    return this.post(url, formData, query)
  },
  openFileFromResponse (blob, fileName) {
    if (blob.size) {
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, fileName)
      } else {
        const blobUrl = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.download = fileName
        anchor.href = blobUrl
        anchor.click()
        window.URL.revokeObjectURL(blobUrl)
      }
    }
    return blob
  },
  abortableFetch (request, opts) {
    const controller = new AbortController()
    const signal = controller.signal
    const token = window.localStorage.token
    const headers = new Headers({ Authorization: `Bearer ${token}` })
    return {
      abort: () => controller.abort(),
      ready: fetch(request, { ...opts, signal, headers })
    }
  },
  getUrl (url, query) {
    const urlObj = new URL(url)
    if (query) {
      const searchParams = new URLSearchParams(query)
      for (const entry of [...searchParams.entries()]) {
        if (!entry[1] || entry[1] === 'null') {
          searchParams.delete(entry[0])
        }
      }
      urlObj.search = searchParams
    }
    return urlObj
  }
}
