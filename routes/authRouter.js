const router = require('express').Router()

const signupValidator = require('../validator/auth/signupValidator')
const {
    isNotAuthenticated,
    isAuthenticated
} = require('../middlewares/authMiddleware')

const {
    signupGetController,
    signupPostController,
    loginGetController,
    loginPostController,
    logoutController,
    changePasswordGetController,
    changePasswordPostController
} = require('../controllers/authController')

router.get('/signup', isNotAuthenticated, signupGetController)
router.post('/signup', [isNotAuthenticated, signupValidator], signupPostController)

router.get('/login', isNotAuthenticated, loginGetController)
router.post('/login', isNotAuthenticated, loginPostController)

router.get('/change-password', isAuthenticated, changePasswordGetController)
router.post('/change-password', isAuthenticated, changePasswordPostController)

router.get('/logout', logoutController)

module.exports = router
