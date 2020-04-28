const router = require('express').Router()

const { isAuthenticated } = require('../../middlewares/authMiddleware')

const {
    likeGetController,
    dislikeGetController
} = require('../controllers/likeDislikeController')

const {
    commentPostController,
    commentReplyPostController
} = require('../controllers/commentController')

const { bookmarkGetController } = require('../controllers/bookmarkController')

router.get('/like/:postId', isAuthenticated, likeGetController)
router.get('/dislike/:postId', isAuthenticated, dislikeGetController)

router.post('/comment/:postId', isAuthenticated, commentPostController)
router.post('/comment/reply/:commentId', isAuthenticated, commentReplyPostController)

router.get('/bookmark/:postId', isAuthenticated, bookmarkGetController)

module.exports = router