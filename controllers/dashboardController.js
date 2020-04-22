const { validationResult } = require('express-validator')

const User = require('../models/User')
const Profile = require('../models/Profile')
const Flash = require('../utils/Flash')
const errorFormatter = require('../utils/validatorErrorFormatter')

exports.dashboardGetController = async (req, res, next) => {
    try {
        let profile = await Profile.findOne({ user: req.user._id })

        if (profile) {
            return res.render('pages/dashboard/dashboard',
                {
                    title: "Dashboard",
                    path: 'dashboard',
                    flashMessage: Flash.getMessage(req)
                })
        }

        res.redirect('/dashboard/create-profile')
    } catch (error) {
        next(error)
    }
}

exports.createProfileGetController = async (req, res, next) => {
    try {
        let profile = await Profile.findOne({ user: req.user._id })

        if (!profile) {
            return res.render('pages/dashboard/create-profile',
                {
                    title: "Create your profile",
                    path: 'dashboard',
                    flashMessage: Flash.getMessage(req),
                    error: {}
                })
        }

        res.redirect('/dashboard')

    } catch (e) {
        next(e)
    }
}

exports.createProfilePostController = async (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormatter)
    const { name, title, bio, website, facebook, twitter, github } = req.body

    if (!errors.isEmpty()) {
        return res.render('pages/dashboard/create-profile',
            {
                title: "Create your profile",
                path: 'dashboard',
                flashMessage: Flash.getMessage(req),
                error: errors.mapped()
            })
    }

    try {
        let profile = new Profile({
            user: req.user._id,
            name,
            title,
            bio,
            profilePic: req.user.profilePic,
            links: {
                website,
                facebook,
                twitter,
                github
            },
            posts: [],
            bookmarks: []
        })

        let createdProfile = await profile.save()
        await User.findOneAndUpdate(
            { _id: req.user._id },
            { $set: { profile: createdProfile._id } }
        )

        req.flash('success', 'Profile Created Successfully')
        res.redirect('/dashboard')

    } catch (e) {
        next(e)
    }

}

exports.editProfileGetController = async (req, res, next) => {
    try {
        let profile = await Profile.findOne({ user: req.user._id })
        if (profile) {
            return res.render('pages/dashboard/edit-profile',
                {
                    title: "Edit your profile",
                    path: 'dashboard',
                    flashMessage: Flash.getMessage(req),
                    error: {},
                    profile
                })
        }

        res.redirect('/dashboard/create-profile')

    } catch (error) {

    }
}

exports.editProfilePostController = async (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormatter)
    const { name, title, bio, website, facebook, twitter, github } = req.body

    if (!errors.isEmpty()) {
        return res.render('pages/dashboard/create-profile',
            {
                title: "Create your profile",
                path: 'dashboard',
                flashMessage: Flash.getMessage(req),
                error: errors.mapped(),
                profile: {
                    name, title, bio,
                    links: {
                        website, facebook, twitter, github
                    }
                }
            })
    }

    try {
        let updatedProfile = {
            name,
            title,
            bio,
            links: {
                website,
                facebook,
                twitter,
                github
            }
        }

        await Profile.findOneAndUpdate(
            { user: req.user._id },
            { $set: updatedProfile },
            { new: true }
        )

        req.flash('success', 'Profile Created Updated')
        res.redirect('/dashboard/edit-profile')

    } catch (e) {
        next(e)
    }

}