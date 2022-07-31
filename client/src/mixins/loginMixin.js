export default {
  data: () => ({
    user: {
      identifier: null,
      password: null,
      birthday: null,
      phone: null,
      securityQuestion1: null,
      securityQuestion2: null,
      securityAnswer1: null,
      securityAnswer2: null
    }
  }),
  computed: {
    isValidLoginCredentials () {
      return this.user.identifier && this.user.password
    }
  }
}
