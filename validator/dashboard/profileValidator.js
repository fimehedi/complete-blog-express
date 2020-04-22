const { body } = require('express-validator')
const validator = require('validator')

const linkValidator = value => {
    if (value && !validator.isURL(value)) {
        throw new Error("Please provide valid url")
    }
    return true
}

module.exports = [
    body('name')
        .not().isEmpty().withMessage('Name can not be empty').trim()
        .isLength({ max: 50 }).withMessage('Name cat not be more then 50 chars'),

    body('title')
        .not().isEmpty().withMessage('Title can not be empty').trim()
        .isLength({ max: 100 }).withMessage('Title can not be more then 100 chars'),

    body('bio')
        .not().isEmpty().withMessage('Bio can not be empty').trim()
        .isLength({ max: 500 }).withMessage('Bio can not be more then 500 chars'),

    body('website')
        .custom(linkValidator),

    body('facebook')
        .custom(linkValidator),

    body('twitter')
        .custom(linkValidator),

    body('github')
        .custom(linkValidator),
]