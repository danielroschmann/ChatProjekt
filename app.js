import express from 'express'

import session from 'express-session'

import fs from 'node:fs'

import {chats, brugere} from './index.js'

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
    res.render('login')
})

app.post('/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    console.log(username + " " + password)
    if(checkCredentials(username, password)) {
            req.session.isLoggedIn = true
            req.session.username = username
            res.redirect('chats')
    } else {
        res.render('error')
    }
    //const { username, password } = req.session.body
})

app.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})


app.get('/', (req, res) => {
    res.render('homepage', {isKnownUser: req.session.isLoggedIn})
})

app.get('/chats', (req, res) => {
    res.render('chats', {chats: chats, isKnownUser: req.session.isLoggedIn})
})

app.get('/users', (req, res) => {
    res.render('users', {brugere: brugere, isKnownUser: req.session.isLoggedIn})
})
app.get('/chats/:id', (req, res) => {
    const chatId = Number(req.params.id)
    const chat = chats.find(c => c.id === chatId)

    res.render('chatServer', {chat: chat, isKnownUser: req.session.isLoggedIn})
})
app.get('/chats/:id/messages', (req, res) => {
    const chatId = Number(req.params.id)
    const chat = chats.find(c => c.id === chatId)
    console.log(chat)

    res.render('messages', {chat: chat, isKnownUser: req.session.isLoggedIn})
})

app.listen(port, () => {
    console.log("Listening on port 8000");
})

function checkCredentials(username, password) {
    let validate = false
    brugere.forEach(bruger => {
        if (username == bruger.navn && password == bruger.password) 
            {
            validate = true
            }
        }
    )
    return validate
}
