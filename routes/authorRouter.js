const router = require('express').Router()

const { authorProfileGetController } = require('../controllers/authorController')

router.get('/:user', authorProfileGetController)


module.exports = router