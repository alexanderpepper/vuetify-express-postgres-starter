const EmailService = require('../services/email.service')

exports.sendSupportMessage = async (req, res) => {
  await EmailService.sendSupportMessage(req.body)
  res.success()
}
