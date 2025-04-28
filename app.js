import express from 'express'
import session from 'express-session'
import fs from 'node:fs'
import {gemJSON, læsJSON} from './index.js'
import Besked from './models/Besked.js'
import Ejer from './models/Ejer.js'
import Chat from './models/Chat.js'
import path from 'path'

const app = express()
const port = 8000

const DATA_PATH = './data'
const EJER_FIL = path.join(DATA_PATH, 'users.json')
const CHAT_FIL = path.join(DATA_PATH, 'chats.json')
const BESKED_FIL = path.join(DATA_PATH, 'messages.json')

let brugere = []
let chats = []
let messages = []

app.set('view engine', 'pug')

app.use(session({
    secret: 'chathygge',
    resave: true,
    saveUninitialized: true
}))

app.use(express.static('public'))

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

brugere = læsJSON(EJER_FIL)

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

app.get('/opretBruger', (req, res) => {
    res.render('opretBruger')
})

app.post('/opretBruger', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const dato = new Date().toLocaleDateString()
    const id = brugere.length > 0 ? brugere[brugere.length - 1].id + 1 : 1
    if (brugere.find(b => b.navn === username) !== undefined) {
        return res.render('error')
    }

    let bruger = new Ejer(id, username, password, dato, 1)
    brugere.push(bruger)
    brugere = gemJSON(EJER_FIL, brugere)
    req.session.isLoggedIn = true
    req.session.username = username
    res.redirect('/chats')
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
