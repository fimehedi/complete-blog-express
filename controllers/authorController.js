const User = require('../models/User')

const Flash = require('../utils/Flash')

exports.authorProfileGetController = async (req, res, next) => {

    let { user } = req.params

    try {
        let author = await User.findOne({ username: user })
            .populate({
                path: 'profile',
                populate: {
                    path: 'posts'
                }
            })
        console.log(author)
        res.render('pages/explorer/author', {
            title: author.profile.name,
            path: '',
            flashMessage: Flash.getMessage(req),
            author
        })

    } catch (error) {
        next(error)
    }


}