import express from 'express'

import session from 'express-session'

import {chats, brugere, Ejer, Chat, Besked} from './index.js'

const app = express()

const port = 8000


app.set('view engine', 'pug')

app.use(session({
    secret: 'chathygge',
    resave: true,
    saveUninitialized: true
}))

function checkAccess(req,res,next) {
    console.log("Forsøger at få adgang til siden " + req.url)
    if (req.url.includes('/chats') && !req.session.isLoggedIn || req.url.includes('/users') && !req.session.isLoggedIn)  {
        res.render('error')
    } else {
        next()
    }
}
app.use(checkAccess)

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

app.get('/opret', (req, res) => {
    res.render('opretBruger')
})

app.post('/opretBruger', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const dato = Date.now
    let bruger = new Ejer(1, username, password, dato, 1)
    if (brugere.find(b => b.navn === username) !== undefined) {
        res.render('error')
    } else {
    brugere.push(bruger)
    req.session.isLoggedIn = true
    req.session.username = username
    res.redirect('/chats')
    }
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
