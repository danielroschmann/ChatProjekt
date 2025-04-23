import express from 'express'

import session from 'express-session'

import {chats, brugere, beskeder} from './index.js'

const app = express()

const port = 8000



app.set('view engine', 'pug')

app.use(session({
    secret: 'chathygge',
    resave: true,
    saveUninitialized: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/login', (req, res) => {
    //const { username, password } = req.session.body
    res.render('login')
})

app.get('/', (req, res) => {
    res.render('homepage')
})

app.get('/chats', (req, res) => {
    res.render('chats', {chats: chats})
})

app.get('/users', (req, res) => {
    res.render('users', {brugere: brugere})
})

app.get('/chats/:id', (req, res) => {
    const chatId = Number(req.params.id)
    const chat = chats.find(c => c.id === chatId)

    res.render('messages', {beskeder: chat})
})

app.listen(port, () => {
    console.log("Listening on port 8000");
})