exports.validationSuccessResponse = async (req, res) => {
  res.json({
    status: 200,
    messages: ['Validated successfully']
  })
}
