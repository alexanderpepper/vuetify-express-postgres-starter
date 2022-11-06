const UserService = require('../services/user.service')

exports.me = async (req, res) => {
  const user = await UserService.me({ id: req.userId })
  if (user) {
    res.json(user)
  } else {
    res.json({
      status: 400,
      messages: ['User not found ']
    })
  }
}

exports.account = async (req, res) => {
  const user = await UserService.account({ id: req.userId })
  if (user) {
    res.json(user)
  } else {
    res.json({
      status: 400,
      messages: ['User not found ']
    })
  }
}

exports.updateAccount = async (req, res) => {
  if (req.userId === req.body.id) {
    const id = await UserService.updateAccount(req.body)
    res.json({ id })
  } else {
    res.status(403).send({
      status: 403,
      messages: ['Unauthorized']
    })
  }
}

exports.all = async (req, res) => {
  res.json(await UserService.all())
}

exports.get = async (req, res) => {
  const user = await UserService.get({ id: req.params.id })
  if (user) {
    res.json(user)
  } else {
    res.json({
      status: 400,
      messages: ['User not found']
    })
  }
}

exports.create = async (req, res) => {
  res.json(await UserService.create(req.body))
}
exports.update = async (req, res) => {
  res.json(await UserService.update(req.body))
}

exports.delete = async (req, res) => {
  const success = await UserService.delete({ id: req.params.id })
  if (success) {
    res.json({
      status: 200,
      messages: ['Deleted successfully']
    })
  } else {
    res.json({
      status: 400,
      messages: ['User not found']
    })
  }
}
