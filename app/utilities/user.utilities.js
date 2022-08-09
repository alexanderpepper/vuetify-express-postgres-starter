module.exports.formattedPhone = user => {
  if (user.isInternationalPhone) {
    return `+${user.phone}`
  } else {
    return `(${user.phone.substring(0, 3)}) ${user.phone.substring(3, 6)}-${user.phone.substring(6)}`
  }
}

module.exports.obscuredPhone = user => {
  if (user.phone) {
    const lastDigits = user.phone.substr(user.phone.length - 2)
    return user.isInternationalPhone ? `+•• •••••••••${lastDigits}` : `(•••) •••-••${lastDigits}`
  } else {
    return ''
  }
}

module.exports.obscuredEmail = user => {
  if (user.email) {
    const emailComponents = user.email.split('@')
    const username = emailComponents[0]
    const domain = emailComponents[1]
    const firstTwoCharacters = username.substring(0, 2)
    const lastTwoCharacters = username.substring(username.length - 2)
    return `${firstTwoCharacters}•••••••${lastTwoCharacters}@${domain}`
  } else {
    return ''
  }
}
