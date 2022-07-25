import api from '../constants/api.js'
import request from 'superagent'
class UploadService {
  static uploadFile (file) {
    return this.fileUploadRequest(file)
      .then(response => api.uploadedFile(response.body.result.files.file[0].providerResponse.location
        .split('/').splice(3).join('/')
        .replace(/\+/g, '%20')))
  }

  static fileUploadRequest (file) {
    return request.post(api.uploadFile)
      .attach('file', file)
      .set('Authorization', window.localStorage.token)
      .catch(err => console.log(err))
  }
}

export default UploadService
