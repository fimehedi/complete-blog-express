const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')

const User = require('../models/User')
const errorFormatter = require('../utils/validatorErrorFormatter')
const Flash = require('../utils/Flash')

exports.signupGetController = (req, res, next) => {
    res.render('pages/auth/signup',
        {
            title: "Create A New Account",
            path: req.path,
            error: {},
            value: {},
            flashMessage: Flash.getMessage(req)
        })
}

exports.signupPostController = async (req, res, next) => {
    let { username, email, password } = req.body

    const errors = validationResult(req).formatWith(errorFormatter)
    if (!errors.isEmpty()) {
        return res.render('pages/auth/signup',
            {
                title: "Create A New Account",
                path: req.path,
                error: errors.mapped(),
                value: {
                    username, email, password
                },
                flashMessage: Flash.getMessage(req)

            })
    }

    try {
        let user = new User({
            username,
            email,
            password: await bcrypt.hash(password, 12),
        })

        await user.save()
        req.flash('success', "Account Successfully Created")
        res.redirect('login')

    } catch (e) {
        console.log(e)
        next(e)
    }
}

exports.loginGetController = (req, res, next) => {
    res.render('pages/auth/login',
        {
            title: "Login to your account",
            path: req.path,
            userOrEmail: '',
            error: '',
            flashMessage: Flash.getMessage(req)
        })


}

exports.loginPostController = async (req, res, next) => {
    let { userOrEmail, password } = req.body
    let error = {
        user: userOrEmail ? "" : "Please provide a user name or email",
        pass: password ? "Please enter correct password" : "Please enter your password"
    }
    try {
        let correctUser = await User.findOne({ username: userOrEmail }) || await User.findOne({ email: userOrEmail })

        if (!correctUser) {
            req.flash('error', "Invalid Credentials")

            return res.render('pages/auth/login',
                {
                    title: "Login to your account",
                    path: req.path,
                    userOrEmail,
                    error,
                    flashMessage: Flash.getMessage(req)
                })
        }

        let correctPassword = await bcrypt.compare(password, correctUser.password)

        if (!correctPassword) {
            req.flash('error', "Invalid Credentials")
            return res.render('pages/auth/login',
                {
                    title: "Login to your account",
                    path: req.path,
                    userOrEmail,
                    error,
                    flashMessage: Flash.getMessage(req)
                })
        }

        req.session.isLoggedIn = true
        req.session.user = correctUser

        req.session.save(err => {
            if (err) {
                console.log(err)
                return next(err)
            }
            req.flash('success', "Account Successfully Logged in")
            res.redirect('/dashboard')
        })


    } catch (e) {
        console.log(e)
    }
}

exports.logoutController = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err)
            return next(err)
        }
        // req.flash('error', "Account Successfully Logged Out")
        return res.redirect('/')

    })
}
