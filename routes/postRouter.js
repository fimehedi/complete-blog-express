const router = require('express').Router()

const { isAuthenticated } = require('../middlewares/authMiddleware')
const postValidator = require('../validator/dashboard/post/postValidator')
const upload = require('../middlewares/uploadMiddleware')

const {
    createPostGetController,
    createPostPostController,
    editPostGetController,
    editPostPostController,
    deletePostGetController,
    allPostGetController
} = require('../controllers/postController')

router.get('/create', isAuthenticated, postValidator, createPostGetController)
router.post('/create', isAuthenticated, upload.single('post-thumbnail'), postValidator, createPostPostController)

router.get('/edit/:postId', isAuthenticated, postValidator, editPostGetController)
router.post('/edit/:postId', isAuthenticated, upload.single('post-thumbnail'), postValidator, editPostPostController)

router.get('/delete/:postId', isAuthenticated, deletePostGetController)

router.get('/', isAuthenticated, allPostGetController)

module.exports = router