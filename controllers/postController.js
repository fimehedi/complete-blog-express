const Flash = require('../utils/Flash')

exports.createPostGetController = (req, res, next) => {
    res.render('pages/dashboard/post/create-post', {
        title: "Create A New Post",
        path: '',
        flashMessage: Flash.getMessage(req)
    })
}