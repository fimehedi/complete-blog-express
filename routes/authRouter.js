const router = require('express').Router()

const signupValidator = require('../validator/auth/signupValidator')
const { isNotAuthenticated } = require('../middlewares/authMiddleware')

const {
    signupGetController,
    signupPostController,
    loginGetController,
    loginPostController,
    logoutController
} = require('../controllers/authController')

router.get('/signup', isNotAuthenticated, signupGetController)
router.post('/signup', [isNotAuthenticated, signupValidator], signupPostController)

router.get('/login', isNotAuthenticated, loginGetController)
router.post('/login', isNotAuthenticated, loginPostController)

router.get('/logout', logoutController)

module.exports = router
