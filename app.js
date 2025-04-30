import express from 'express'
import session from 'express-session'
import { checkAccess } from './controllers/authController.js'
import messageRoute from './routes/messageRoutes.js'
import chatRoute from './routes/chatRoutes.js'
import authRoute from './routes/authRoutes.js'
import userRoute from './routes/brugerRoutes.js'

const app = express()

const port = 8000

// Middleware
app.use(session({
    secret: 'chathygge',
    resave: true,
    saveUninitialized: false,
    cookie: { secure: false }
}))

app.set('view engine', 'pug')

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(checkAccess)

app.use('/', messageRoute)
app.use('/', chatRoute)
app.use('/', authRoute)
app.use('/', userRoute)

app.get('/', (req, res) => {
    res.render('homepageView', {isKnownUser: req.session.isLoggedIn})
})

// Server
app.listen(port, () => {
    console.log("Listening on port 8000");
})


