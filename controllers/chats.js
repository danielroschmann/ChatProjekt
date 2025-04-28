import { EJER_FIL, CHAT_FIL, BESKED_FIL } from "./filData.js"
import { læsJSON, gemJSON } from "./filData.js"
import Chat from "../models/Chat.js"

export const createChat = async (req, res) => {
    let chatNavn = req.body.chatNavn
    let ejerNavn = req.session.username
    let chatArr = læsJSON(CHAT_FIL)
    let id;
    if (chatArr === undefined) {
        id = 1
        chatArr = []
    } else {
        id = chatArr.length > 0 ? chatArr[chatArr.length - 1].id + 1 : 1
        }
    let dato = new Date().toLocaleString()
    let ejerArr = læsJSON(EJER_FIL)
    console.log("Ejer arr:" + ejerArr)
    let ejer = ejerArr.find(ejer => ejer.navn === ejerNavn)
    console.log(ejer)
    let nyChat = new Chat(id, chatNavn, dato, ejer)
    chatArr.push(nyChat)
    await gemJSON(CHAT_FIL, chatArr)
    res.render('chats', {chats: chatArr, isKnownUser: req.session.isLoggedIn})
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

export const getChatMessages = (req, res) => {
    const chatId = Number(req.params.id)
    let chats = læsJSON(CHAT_FIL)
    const chat = chats.find(c => c.id === chatId)
    console.log(chat)
    
    res.render('messages', {chat: chat, isKnownUser: req.session.isLoggedIn, username: req.session.username})
}

export const getDetailedChatMessage = (req, res) => {
    const messageId = Number(req.params.id)
    const message = læsJSON(BESKED_FIL).find(besked => besked.id === messageId)
    
    res.render('message', {besked: message})
}


