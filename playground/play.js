const router = require('express').Router()
const upload = require('../middlewares/uploadMiddleware')


router.get('/play', (req, res,) => {
    res.render('playground/play', {
        path: req.path,
        flashMessage: ''
    })
})

router.post('/play', upload.single('my-file'), (req, res,) => {

    console.log(req.file)

    res.render('playground/play', {
        path: req.path,
        flashMessage: ''
    })
})

module.exports = router