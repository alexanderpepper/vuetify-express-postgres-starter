module.exports = (sequelize, Sequelize) =>
  sequelize.define('app_user', {
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    activationCode: {
      type: Sequelize.STRING
    },
    passwordResetCode: {
      type: Sequelize.STRING
    },
    isActivated: {
      type: Sequelize.BOOLEAN
    },
    name: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.STRING
    },
    isInternationalPhone: {
      type: Sequelize.BOOLEAN
    },
    photo: {
      type: Sequelize.STRING
    },
    birthday: {
      type: Sequelize.DATE
    },
    country: {
      type: Sequelize.STRING
    },
    addressLine1: {
      type: Sequelize.STRING
    },
    addressLine2: {
      type: Sequelize.STRING
    },
    city: {
      type: Sequelize.STRING
    },
    state: {
      type: Sequelize.STRING
    },
    zipCode: {
      type: Sequelize.STRING
    },
    securityQuestion1: {
      type: Sequelize.STRING
    },
    securityAnswer1: {
      type: Sequelize.STRING
    },
    securityQuestion2: {
      type: Sequelize.STRING
    },
    securityAnswer2: {
      type: Sequelize.STRING
    }
  },
  {
    underscored: true,
    freezeTableName: true
  })
