const UserService = require('../services/user.service')

exports.me = async (req, res) => {
  const user = await UserService.me({ id: req.userId })
  if (user) {
    res.json(user)
  } else {
    res.badRequest(['Account not found '])
  }
}

exports.account = async (req, res) => {
  const user = await UserService.account({ id: req.userId })
  if (user) {
    res.json(user)
  } else {
    res.badRequest(['Account not found '])
  }
}

exports.updateAccount = async (req, res) => {
  if (req.userId === req.body.id) {
    const id = await UserService.updateAccount(req.body)
    res.json({ id })
  } else {
    res.forbidden(['Unauthorized'])
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
    res.badRequest(['Account not found'])
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
    res.success(['Deleted successfully'])
  } else {
    res.badRequest(['Account not found'])
  }
}

exports.lock = async (req, res) => {
  const { id, isLocked } = req.params
  const success = await UserService.lock({ id, isLocked })
  if (success) {
    res.success([`${isLocked ? 'Locked' : 'Unlocked'} successfully`])
  } else {
    res.badRequest(['Account not found'])
  }
}
