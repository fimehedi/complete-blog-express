const { validationResult } = require('express-validator')
const readingTime = require('reading-time')

const Flash = require('../utils/Flash')
const errorFormatter = require('../utils/validatorErrorFormatter')

const Post = require('../models/Post')
const Profile = require('../models/Profile')

exports.createPostGetController = (req, res, next) => {
    res.render('pages/dashboard/post/create-post', {
        title: "Create A New Post",
        path: '',
        flashMessage: Flash.getMessage(req),
        error: {},
        value: {}
    })
}

exports.createPostPostController = async (req, res, next) => {
    let { title, body, tags } = req.body
    let errors = validationResult(req).formatWith(errorFormatter)

    if (!errors.isEmpty()) {
        return res.render('pages/dashboard/post/create-post', {
            title: "Create A New Post",
            path: 'create',
            flashMessage: Flash.getMessage(req),
            error: errors.mapped(),
            value: { title, body, tags }
        })
    }

    if (tags) {
        tags = tags.split(',')
        tags = tags.map(tag => tag.trim())
    }

    let readTime = readingTime(body).text

    let post = new Post({
        title,
        body,
        author: req.user._id,
        tags,
        thumbnail: req.file ? `/uploads/${req.file.filename}` : '',
        readTime,
        likes: [],
        dislikes: [],
        comments: []
    })

    try {
        let createdPost = await post.save()
        await Profile.findOneAndUpdate(
            { user: req.user._id },
            { $push: { 'posts': createdPost._id } }
        )

        req.flash('success', 'Post Created Successfully')
        res.redirect(`/post/edit/${createdPost._id}`)

    } catch (error) {
        console.log(error)
        next(errors)
    }
}

exports.editPostGetController = async (req, res, next) => {
    let { postId } = req.params

    try {
        let post = await Post.findOne({ _id: postId, author: req.user._id })

        if (!post) {
            console.log("Post Not Found")
            throw new Error("Page Not Found")
        }

        res.render('pages/dashboard/post/edit-post', {
            title: "Edit to your Post",
            path: 'create',
            flashMessage: Flash.getMessage(req),
            error: {},
            post
        })

    } catch (error) {
        console.log(error)
        next(error)
    }
}

exports.editPostPostController = async (req, res, next) => {
    let { postId } = req.params

    let { title, body, tags } = req.body

    try {
        let post = await Post.findOne({ _id: postId, author: req.user._id })

        if (!post) {
            console.log("Post Not Found")
            throw new Error('Page Not Found')
        }

        let errors = validationResult(req).formatWith(errorFormatter)
        if (!errors.isEmpty()) {
            return res.render('pages/dashboard/post/create-post', {
                title: "Create A New Post",
                path: '',
                flashMessage: Flash.getMessage(req),
                error: errors.mapped(),
                value: { title, body, tags }
            })
        }

        if (tags) {
            tags = tags.split(',')
            tags = tags.map(tag => tag.trim())
        }

        let readTime = readingTime(body).text

        await Post.findOneAndUpdate(
            { _id: post._id },
            { $set: { title, body, tags, thumbnail: req.file ? req.file.filename : post.thumbnail, readTime } },
            { new: true }
        )

        req.flash('success', 'Post Updated Successfully')
        res.redirect(`/post/edit/${post._id}`)

    } catch (error) {
        console.log(error)
        next(error)
    }
}

exports.deletePostGetController = async (req, res, next) => {
    let { postId } = req.params

    try {
        let post = await Post.findOne({ _id: postId, author: req.user._id })

        if (!post) {
            console.log("Post Not Found")
            throw new Error('Page Not Found')
        }

        await Post.findOneAndDelete({ _id: postId })
        await Profile.findOneAndUpdate(
            { user: req.user._id },
            { $pull: { 'posts': postId } }
        )

        req.flash('success', 'Post Deleted Successfully')
        res.redirect('/post')

    } catch (error) {
        next(error)
    }
}

exports.allPostGetController = async (req, res, next) => {
    try {
        let posts = await Post.find({ author: req.user._id })
        res.render('pages/dashboard/post/posts', {
            title: "Created Posts",
            path: '',
            flashMessage: Flash.getMessage(req),
            posts
        })
    } catch (error) {
        next(error)
    }
}
