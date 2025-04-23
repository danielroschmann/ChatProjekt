import express from 'express'

import session from 'express-session'

const app = express()

const port = 8000


app.set('view engine', 'pug')

app.use(session({
    secret: 'chathygge',
    resave: true,
    saveUninitialized: true
}))

app.get('/login', (req, res) => {
    const { username, password } = req.session.body
    res.render('login')
})

app.get('/', (req, res) => {
    res.render('homepage')
})

app.listen(port, () => {
    console.log("Listening on port 8000");
})