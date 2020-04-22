const router = require('express').Router()

const { isAuthenticated } = require('../middlewares/authMiddleware')

const {
    createPostGetController
} = require('../controllers/postController')

router.get('/create', isAuthenticated, createPostGetController)

module.exports = router