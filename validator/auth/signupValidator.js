const { body } = require('express-validator')

const User = require('../../models/User')

module.exports = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 15 }).withMessage("Username must be between 3 to 15 character")
        .custom(async username => {
            let user = await User.findOne({ username })
            if (user) {
                return Promise.reject("Username already used")
            }
        }),
    body('email')
        .normalizeEmail()
        .isEmail().withMessage("Please provide a valid email")
        .custom(async email => {
            let user = await User.findOne({ email })
            if (user) {
                return Promise.reject("Email already used")
            }
        }),
    body('password')
        .isLength({ min: 6 }).withMessage("Your password must be at least 6 characters long"),
    body('confirmPassword')
    .not().isEmpty().withMessage("Please retype your password")
        .custom((confirmPassword, { req }) => {
            if (confirmPassword !== req.body.password) {
                throw new Error('Password doesn\'t Match')
            }
            return true
        })
]