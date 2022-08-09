import { formattedPhone } from '../../../app/utilities/user.utilities'

export default {
  props: {
    user: Object
  },
  computed: {
    email () {
      return this.user.obscuredEmail || this.user.email
    },
    phone () {
      return this.user.obscuredPhone || formattedPhone(this.user)
    }
  }
}
