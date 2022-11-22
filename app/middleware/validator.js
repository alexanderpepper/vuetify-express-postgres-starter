const ValidationService = require('../services/validation.service')

const runValidations = (validations, failureMessage) => {
  return async (req, res, next) => {
    const validationErrors = {}

    for (const validation of validations) {
      await validation(req.body, validationErrors)
    }

    if (Object.keys(validationErrors).length) {
      res.badRequest([failureMessage], { validationErrors })
    } else {
      next()
    }
  }
}

exports.validateSignUpCredentials = runValidations([
  ValidationService.addSignUpGeneralValidationErrors
], 'Please fix validation errors')

exports.validateSignUpPassword = runValidations([
  ValidationService.addSignUpPasswordValidationErrors
], 'Please fix validation errors')

exports.validateSignUpSecurityQuestions = runValidations([
  ValidationService.addSignUpSecurityQuestionValidationErrors
], 'Please fix validation errors')

exports.validateSignUp = runValidations([
  ValidationService.addSignUpGeneralValidationErrors,
  ValidationService.addSignUpPasswordValidationErrors,
  ValidationService.addSignUpSecurityQuestionValidationErrors
], 'Unable to create account')

exports.validateSignIn = runValidations([
  ValidationService.addSignInValidationErrors
], 'Username and password are required')

exports.validatePasswordChange = (req, res, next) =>
  runValidations([
    ValidationService.addChangePasswordValidationErrors
  ], 'Unable to change password')({ ...req, body: { ...req.body, id: req.userId } }, res, next)

exports.validateAccountUpdate = runValidations([
  ValidationService.addSignUpGeneralValidationErrors,
  ValidationService.addSignUpSecurityQuestionValidationErrors
], 'Unable to update account')

exports.validateGetSendOptions = runValidations([
  ValidationService.addGetSendOptionsValidationErrors
], 'Please fix validation errors')

exports.validateGetSecurityQuestions = runValidations([
  ValidationService.addGetSecurityQuestionsValidationErrors
], 'Please fix validation errors')

exports.validateSecurityAnswers = runValidations([
  ValidationService.addSignUpSecurityQuestionValidationErrors
], 'Please fix validation errors')

exports.validateActivation = runValidations([
  ValidationService.addActivationValidationErrors
], 'Unable to activate user')

exports.validateSendActivationLink = runValidations([
  ValidationService.addSendActivationLinkValidationErrors
], 'Unable to send activation link')

exports.validateSendPasswordResetLink = runValidations([
  ValidationService.addSendPasswordResetLinkValidationErrors
], 'Unable to send password reset link')

exports.validateSendUsername = runValidations([
  ValidationService.addSendUsernameValidationErrors
], 'Unable to send username')

exports.validateSetPassword = runValidations([
  ValidationService.addSetPasswordValidationErrors
], 'Unable to set password')

exports.validateSendSupportMessage = runValidations([
  ValidationService.addSendSupportMessageValidationErrors
], 'Unable to send message')
