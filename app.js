require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const chalk = require('chalk')

const app = express()

// Setup view engine
app.set('view engine', 'ejs')
app.set('views', 'views')

const DatabaseURL = config.get('db-url')

const setMiddleware = require('./middlewares/middlewares')
const setRoute = require('./routes/routes')

// Middleware
setMiddleware(app)

// Router
setRoute(app)

// Port
const PORT = process.env.PORT || 8080

// Server
mongoose
    .connect(DatabaseURL,
        {
            useNewUrlParser: true
        })
    .then(() => {
        console.log(chalk.green("Database connected"))
        app.listen(PORT, () => {
            console.log(chalk.green(`Application Server : http://localhost:${PORT}`))
        })
    }).catch(err => {
        console.log(chalk.red(err.message))
    })
