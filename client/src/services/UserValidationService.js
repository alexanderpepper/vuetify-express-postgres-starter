class UserValidationService {
  static hasValidPrimaryCredentials (user) {
    return user.email &&
      user.name &&
      user.username &&
      this.isValidEmail(user.email)
  }

  static hasValidPassword (user) {
    return user.password &&
      user.password.length >= 8 &&
      user.confirmPassword &&
      user.password === user.confirmPassword
  }

  static hasValidSecurityQuestions (user) {
    return user.securityQuestion1 &&
      user.securityAnswer1 &&
      user.securityQuestion2 &&
      user.securityAnswer2
  }

  static hasValidPhone (user) {
    return user.phone &&
      (user.isInternationalPhone || user.phone.length === 10)
  }

  static hasValidAddress (user) {
    return user.addressLine1 &&
      user.city &&
      user.country &&
      (user.country === 'United States' ? user.state && user.zipCode : true)
  }

  static hasValidPhoto (user) {
    return user.photo
  }

  static hasValidBirthday (user) {
    return user.birthday
  }

  static hasValidSecondaryIdentifier (user) {
    return (user.phone && this.hasValidPhone(user)) ||
      (user.addressLine1 && this.hasValidAddress(user)) ||
      user.birthday
  }

  static isValidEmail (input) {
    return /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$/.test(input)
  }
}

export default UserValidationService
