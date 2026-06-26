const express = require('express')
const router = express.Router()
const { lookupUserByUsername } = require('../controllers/userController')

router.get('/lookup', lookupUserByUsername)

module.exports = router