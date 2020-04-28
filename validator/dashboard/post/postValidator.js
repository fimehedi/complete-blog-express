const { body } = require('express-validator')
const cheerio = require('cheerio')

module.exports = [
    body('title')
        .not().trim().isEmpty().withMessage('Title can not be empty')
        .isLength({ max: 100 }).withMessage('Title can not be more than 100 chars'),

    body('body')
        .not().trim().isEmpty().withMessage('Post Body can not be empty')
        .custom(value => {
            let node = cheerio.load(value)
            let text = node.html()

            if (text.length > 5000) {
                throw new Error('Body can not be more then 5000 chars')
            }
            return true
        }),

    body('tags')
        .not().trim().isEmpty().withMessage('You must provide minimum one tag')

]