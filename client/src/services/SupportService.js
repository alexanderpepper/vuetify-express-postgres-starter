import BaseService from './BaseService'
import api from '../constants/api.js'

class SupportService extends BaseService {
  static sendSupportMessage (message) {
    return this.POST(api.sendSupportMessage, message)
  }
}

export default SupportService
