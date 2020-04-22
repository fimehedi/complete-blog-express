const router = require('express').Router()

const { isAuthenticated } = require('../middlewares/authMiddleware')
const upload = require('../middlewares/uploadMiddleware')

const {
    uploadProfilePic,
    removeProfilePic,
    postImageUploadController
} = require('../controllers/uploadController')

router.post('/profilePic', isAuthenticated, upload.single('profilePic'), uploadProfilePic)

router.delete('/profilePic', isAuthenticated, removeProfilePic)

router.post('/postimage', isAuthenticated, upload.single('post-image'), postImageUploadController)

module.exports = router