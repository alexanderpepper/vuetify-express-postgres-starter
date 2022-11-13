const UserValidationService = require('../services/user-validation.service')

exports.validateSignUpCredentials = async (req, res, next) => {
  const validationErrors = {}

  await UserValidationService.addSignUpGeneralValidationErrors(req.body, validationErrors)

  if (Object.keys(validationErrors).length) {
    res.badRequest(['Please fix validation errors'], { validationErrors })
  } else {
    next()
  }
}

exports.validateSignUpPassword = async (req, res, next) => {
  const validationErrors = {}

  UserValidationService.addSignUpPasswordValidationErrors(req.body, validationErrors)

  if (Object.keys(validationErrors).length) {
    res.badRequest(['Please fix validation errors'], { validationErrors })
  } else {
    next()
  }
}

exports.validateSignUpSecurityQuestions = async (req, res, next) => {
  const validationErrors = {}

  await UserValidationService.addSignUpSecurityQuestionValidationErrors(req.body, validationErrors)

  if (Object.keys(validationErrors).length) {
    res.badRequest(['Please fix validation errors'], { validationErrors })
  } else {
    next()
  }
}

exports.validateSignUp = async (req, res, next) => {
  const validationErrors = {}

  await UserValidationService.addSignUpGeneralValidationErrors(req.body, validationErrors)
  UserValidationService.addSignUpPasswordValidationErrors(req.body, validationErrors)
  UserValidationService.addSignUpSecurityQuestionValidationErrors(req.body, validationErrors)

  if (Object.keys(validationErrors).length) {
    res.badRequest(['Unable to create account'], { validationErrors })
  } else {
    next()
  }
}

exports.validatePasswordChange = async (req, res, next) => {
  const validationErrors = {}

  await UserValidationService.addChangePasswordValidationErrors({ ...req.body, id: req.userId }, validationErrors)

  if (Object.keys(validationErrors).length) {
    res.badRequest(['Unable to change password'], { validationErrors })
  } else {
    next()
  }
}

exports.validateAccountUpdate = async (req, res, next) => {
  const validationErrors = {}

  await UserValidationService.addSignUpGeneralValidationErrors(req.body, validationErrors)
  UserValidationService.addSignUpSecurityQuestionValidationErrors(req.body, validationErrors)

  if (Object.keys(validationErrors).length) {
    res.badRequest(['Unable to update account'], { validationErrors })
  } else {
    next()
  }
}

exports.validateGetSendOptions = async (req, res, next) => {
  const validationErrors = {}

  UserValidationService.addGetSendOptionsValidationErrors(req.body, validationErrors)

  if (Object.keys(validationErrors).length) {
    res.badRequest(['Please fix validation errors'], { validationErrors })
  } else {
    next()
  }
}

exports.validateGetSecurityQuestions = async (req, res, next) => {
  const validationErrors = {}

  UserValidationService.addGetSecurityQuestionsValidationErrors(req.body, validationErrors)

  if (Object.keys(validationErrors).length) {
    res.badRequest(['Please fix validation errors'], { validationErrors })
  } else {
    next()
  }
}

exports.validateSecurityAnswers = async (req, res, next) => {
  const validationErrors = {}

  UserValidationService.addSignUpSecurityQuestionValidationErrors(req.body, validationErrors)

  if (Object.keys(validationErrors).length) {
    res.badRequest(['Please fix validation errors'], { validationErrors })
  } else {
    next()
  }
}
