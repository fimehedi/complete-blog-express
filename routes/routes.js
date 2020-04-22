const authRoute = require('./authRouter')
const dashboardRoute = require('./dashboardRouter')
const postRoute = require('./postRouter')
const uploadRoute = require('./uploadRouter')
const playgroundRouter = require('../playground/play')
const Flash = require('../utils/Flash')


const routes = [
    {
        path: '/user',
        handler: authRoute
    },
    {
        path: '/dashboard',
        handler: dashboardRoute
    },
    {
        path: '/post',
        handler: postRoute
    },
    {
        path: '/upload',
        handler: uploadRoute
    },
    {
        path: '/playground',
        handler: playgroundRouter
    },
    {
        path: '/',
        handler: (req, res) => {
            res.render('pages/index',
                {
                    path: req.path,
                    flashMessage: Flash.getMessage(req)
                })
        }
    },
    {
        path: '*',
        handler: (req, res) => {
            res.render('pages/error/404',
                {
                    title: "404 Page Not Found",
                    path: req.path,
                    flashMessage: Flash.getMessage(req)
                })
        }
    }
]

module.exports = app => {
    routes.forEach(route => {
        if (route.path === '/') {
            app.get(route.path, route.handler)
        } else {
            app.use(route.path, route.handler)
        }
    });

    app.use((req, res, next) => {
        let error = new Error("Internal Error")
        next(error)
    })

    app.use((error, req, res, next) => {
        console.log(error)
        res.render('pages/error/500', {
            title: "500 Internal Error",
            path: req.path,
            flashMessage: ''
        })
    })
}