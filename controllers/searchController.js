const Post = require('../models/Post')
const Flash = require('../utils/Flash')

exports.searchResultGetController = async (req, res, next) => {
    let term = req.query.term
    let currentPage = parseInt(req.query.page) || 1
    let postPerPage = 10

    try {
        let posts = await Post.find({
            $text: {
                $search: term
            }
        })
            .skip((postPerPage * currentPage) - postPerPage)
            .limit(postPerPage)

        let totalPost = await Post.find({
            $text: {
                $search: term
            }
        })

        let totalPage = totalPost / postPerPage

        res.render('pages/explorer/search', {
            title: `Result for ${term}`,
            path: req.path,
            flashMessage: Flash.getMessage(req),
            searchTerm: term,
            postPerPage,
            currentPage,
            totalPage,
            posts
        })

    } catch (error) {
        next(error)
    }
}