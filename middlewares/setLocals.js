const Flash = require('../utils/Flash')


exports.setUserLocals = () => {
    return (req, res, next) => {
        res.locals.user = req.user
        res.locals.isLoggedIn = req.session.isLoggedIn
        next()
    }
}


exports.setFlashLocals = (req, res, next) => {
    console.log(req)

    next()
}

