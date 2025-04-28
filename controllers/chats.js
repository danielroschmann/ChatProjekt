import { EJER_FIL, CHAT_FIL } from "./filData.js"
import { læsJSON, gemJSON } from "./filData.js"
import Chat from "../models/Chat.js"

export const createChat = (req, res) => {
    let chatNavn = req.body.chatNavn
    let ejerNavn = req.session.username
    let chatArr = læsJSON(CHAT_FIL)
    let id = chatArr.length > 0 ? chatArr[chatArr.length - 1].id + 1 : 0
    let dato = new Date().toLocaleString()
    let ejerArr = læsJSON(EJER_FIL)
    console.log("Ejer arr:" + ejerArr)
    let ejer = ejerArr.find(ejer => ejer.navn === ejerNavn)
    console.log(ejer)
    let nyChat = new Chat(id, chatNavn, dato, ejer)
    chatArr.push(nyChat)
    gemJSON(CHAT_FIL, chatArr)
    res.redirect('/chats')
}

export const getChat = (req, res) => {
    let chats = læsJSON(CHAT_FIL)
    res.render('chats', {chats: chats, isKnownUser: req.session.isLoggedIn})
}

export const getSingleChat = (req, res) => {
    let chats = læsJSON(CHAT_FIL)
    const chatId = Number(req.params.id)
    const chat = chats.find(c => c.id === chatId)
    
    res.render('chatServer', {chat: chat, isKnownUser: req.session.isLoggedIn})
}



