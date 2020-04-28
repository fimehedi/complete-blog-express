const fs = require('fs')
const User = require('../models/User')
const Profile = require('../models/Profile')

exports.uploadProfilePic = async (req, res, next) => {
    let oldProfile = req.user.profilePic
    if (req.file) {
        try {
            let profile = await Profile.findOne({ user: req.user._id })
            let profilePic = `/uploads/${req.file.filename}`
            console.log(profilePic)
            if (profile) {
                await Profile.findOneAndUpdate(
                    { user: req.user._id },
                    { $set: { profilePic } }
                )
            }

            await User.findOneAndUpdate(
                { _id: req.user._id },
                { $set: { profilePic } }
            )

            if (oldProfile !== '/uploads/profile.png') {
                fs.unlink(`public${oldProfile}`, (err) => {
                    console.log(err)
                })
            }

            res.status(200).json({
                profilePic
            })

        } catch (error) {
            res.status(500).json({
                profilePic: req.user.profilePic
            })
        }
    } else {
        res.status(500).json({
            profilePic: req.user.profilePic
        })
    }
}

exports.removeProfilePic = (req, res, next) => {
    try {
        let defaultProfile = '/uploads/profile.png'
        let currentProfile = req.user.profilePic

        if (currentProfile != defaultProfile) {
            fs.unlink(`public${currentProfile}`, async () => {
                let profile = await Profile.findOne({ user: req.user._id })
                if (profile) {
                    await Profile.findOneAndUpdate(
                        { user: req.user._id },
                        { $set: { profilePic: defaultProfile } }
                    )
                }

                await User.findOneAndUpdate(
                    { _id: req.user._id },
                    { $set: { profilePic: defaultProfile } }
                )
            })
        }
        res.status(200).json({
            profilePic: defaultProfile
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Can not remove profile pic'
        })
    }
}

exports.postImageUploadController = (req, res, next) => {
    if (req.file) {
        return res.status(200).json({
            imagUrl: `/uploads/${req.file.filename}`
        })
    }
    return res.status(500).json({
        message: "Error Occurred"
    })
}