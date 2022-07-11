import BaseService from './BaseService'
import gravatar from 'gravatar'

class GravatarService extends BaseService {
  static getAccountPhotoUrl (email) {
    return gravatar.url(email, { s: 240 })
  }
}

export default GravatarService
