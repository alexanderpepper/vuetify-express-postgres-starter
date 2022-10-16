const UserValidationService = require('../services/user-validation.service')

exports.validateSignUpCredentials = async (req, res, next) => {
  const validationErrors = {}
  await UserValidationService.addSignUpGeneralValidationErrors(req.body, validationErrors)
  if (Object.keys(validationErrors).length) {
    res.status(400).send({ status: 400, validationErrors })
  } else {
    next()
  }
}

exports.validateSignUpPassword = async (req, res, next) => {
  const validationErrors = {}
  await UserValidationService.addSignUpPasswordValidationErrors(req.body, validationErrors)
  if (Object.keys(validationErrors).length) {
    res.status(400).send({ status: 400, validationErrors })
  } else {
    next()
  }
}

exports.validateSignUpSecurityQuestions = async (req, res, next) => {
  const validationErrors = {}
  await UserValidationService.addSignUpSecurityQuestionValidationErrors(req.body, validationErrors)
  if (Object.keys(validationErrors).length) {
    res.status(400).send({ status: 400, validationErrors })
  } else {
    next()
  }
}

exports.validateSignUp = async (req, res, next) => {
  const validationErrors = {}

  await UserValidationService.addSignUpGeneralValidationErrors(req.body, validationErrors)
  UserValidationService.addSignUpPasswordValidationErrors(req.body, validationErrors)
  UserValidationService.addSignUpSecurityQuestionValidationErrors(req.body.validationErrors)

  if (Object.keys(validationErrors).length) {
    res.status(400).send({ status: 400, validationErrors })
  } else {
    next()
  }
}
