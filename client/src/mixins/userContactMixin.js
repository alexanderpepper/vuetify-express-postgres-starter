// TODO: This function came from user.utilities.js,
//  but have been duplicated to support dockerization.
//  Eventually, it'd be ideal to keep a shared folder.
const formattedPhone = user => {
  if (user.phone) {
    if (user.isInternationalPhone) {
      return `+${user.phone}`
    } else {
      return `(${user.phone.substring(0, 3)}) ${user.phone.substring(3, 6)}-${user.phone.substring(6)}`
    }
  }
}

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
