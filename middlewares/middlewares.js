const morgan = require('morgan')
const express = require('express')
const session = require('express-session')
const flash = require('connect-flash')
const MongoDBStore = require('connect-mongodb-session')(session);
const config = require('config')

const {blindUserWithRequest} = require('./authMiddleware')
const {setUserLocals} = require('./setLocals')

const DatabaseURL = config.get('db-url')

const store = new MongoDBStore({
    uri: DatabaseURL,
    collection: 'sessions'
})

const middleware = [
    morgan('dev'),
    express.static('public'),
    express.urlencoded({ extended: true }),
    express.json(),
    session({
        secret: config.get('secret'),
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 2
        },
        store: store
    }),
    flash(),
    blindUserWithRequest(),
    setUserLocals(),
]

module.exports = app => {
    app.use(middleware)
}