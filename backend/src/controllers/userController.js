const User = require('../models/user')

const lookupUserByUsername = async (req, res) => {
  const { username } = req.query

  if (!username || typeof username !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'username query parameter required',
    })
  }

  const user = await User.findOne({
    username: username.toLowerCase().trim(),
  }).select('_id username')

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    })
  }

  return res.json({
    success: true,
    data: { _id: user._id, username: user.username },
  })
}

module.exports = { lookupUserByUsername }