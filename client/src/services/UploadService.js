import api from '../constants/api.js'
import request from 'superagent'
import BaseService from '@/services/BaseService'

class UploadService extends BaseService {
  static uploadFile (file) {
    return request.post(api.uploadFile)
      .attach('file', file)
      .set('Authorization', window.localStorage.token)
      .then(response => response.body)
  }

  static downloadFile (key) {
    return this.POST(api.downloadFile, { key })
  }
}

export default UploadService
