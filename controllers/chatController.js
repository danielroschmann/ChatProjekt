import { EJER_FIL, CHAT_FIL, BESKED_FIL } from "./fileStorageController.js"
import { læsJSON, gemJSON } from "./fileStorageController.js"
import Chat from "../models/chatModel.js"

export const createChat = async (req, res) => {
    let chatNavn = req.body.chatNavn.trim()
    let chatArr = læsJSON(CHAT_FIL)
    if (chatNavn === undefined  || chatNavn === '') {
        return res.render('chatsView', {authLevel: req.session.authLevel, chats: chatArr, errorMessage: 'Indtast venligst et navn'})
    }
    if (chatNavn.length > 20) {
        return res.render('chatsView', {authLevel: req.session.authLevel, chats: chatArr, errorMessage: 'Navnet er for langt'})
    }
    if (chatNavn.length < 3) {
        return res.render('chatsView', {authLevel: req.session.authLevel, chats: chatArr, errorMessage: 'Navnet er for kort'})
    }
    let ejerNavn = req.session.username
    let id = generateUniqueId()
    let dato = new Date().toLocaleDateString()
    let ejerArr = læsJSON(EJER_FIL)
    let ejer = ejerArr.find(ejer => ejer.navn === ejerNavn)
    let nyChat = new Chat(id, chatNavn, dato, ejer)
    chatArr.push(nyChat)
    await gemJSON(CHAT_FIL, chatArr)
    res.redirect('/chats')
}


export const getChat = (req, res) => {
    let chats = læsJSON(CHAT_FIL)
    res.render('chatsView', {username: req.session.username, chats: chats, isKnownUser: req.session.isLoggedIn, authLevel: req.session.authLevel})
}

export const getSingleChat = (req, res) => {
    let chats = læsJSON(CHAT_FIL)
    const chatId = Number(req.params.id)
    const chat = chats.find(c => c.id === chatId)
    
    res.render('chatDetailView', {chat: chat, isKnownUser: req.session.isLoggedIn})
}

export const getChatMessages = (req, res) => {
    const chatId = Number(req.params.id)
    let chats = læsJSON(CHAT_FIL)
    const chat = chats.find(c => c.id === chatId)
    
    res.render('chatMessageListView', {chat: chat, isKnownUser: req.session.isLoggedIn, username: req.session.username})
}

export const getDetailedChatMessage = (req, res) => {
    const messageId = Number(req.params.id)
    const message = læsJSON(BESKED_FIL).find(besked => besked.id === messageId)
    
    res.render('messageDetailView', {besked: message})
}

const generateUniqueId = () => {
    const chatArr = læsJSON(CHAT_FIL)
    return chatArr.length > 0 ? chatArr[chatArr.length - 1].id + 1 : 1
}

export const deleteChat = async (req, res) => {
    const chatId = Number(req.params.id)

    let beskedArr = læsJSON(BESKED_FIL)
    let chatArr = læsJSON(CHAT_FIL)
    
    beskedArr = beskedArr.filter(besked => besked.chatId !== chatId)
    chatArr = chatArr.filter(chat => Number(chat.id) !== Number(chatId))
    await gemJSON(CHAT_FIL, chatArr)
    await gemJSON(BESKED_FIL, beskedArr)
    res.redirect('/chats')
}

export const editChat = (req, res) => {
    const chatId = Number(req.params.id)
    const chatArr = læsJSON(CHAT_FIL)
    const chat = chatArr.find(c => Number(c.id) === Number(chatId))
    res.render('chatEditView', {chat: chat, isKnownUser: req.session.isLoggedIn})
}

export const updateChat = (req, res) => {
    const newName = req.body.newName
    const chatId = req.body.chatId
    const chatArr = læsJSON(CHAT_FIL)
    const chat = chatArr.find(chat => Number(chat.id) === Number(chatId))
    let updatedChat = new Chat(
        chatId,
        newName,
        chat.dato,
        chat.ejer
    )
    let updatedChatArr = chatArr.filter(chat => Number(chat.id) !== Number(chatId))
    updatedChatArr.push(updatedChat)
    gemJSON(CHAT_FIL, updatedChatArr)
    res.redirect('/chats')
}


