import { EJER_FIL, CHAT_FIL, BESKED_FIL } from "../utils/jsonUtils.js"
import { læsJSON, gemJSON } from "../utils/jsonUtils.js"
import Chat from "../models/chatModel.js"
import { generateUniqueId } from "../utils/helperUtils.js"
import { getChatFromChatId, handleChatDeletion, handleChatUpdate } from "../utils/chatUtils.js"

const MAX_CHARACTERS = 20
const MIN_CHARACTERS = 3

export const createChat = async (req, res) => {
    let chatNavn = req.body.chatNavn.trim()
    let chatArr = læsJSON(CHAT_FIL)
    if (chatNavn === undefined  || chatNavn === '') {
        return res.render('chatsView', {authLevel: req.session.authLevel, chats: chatArr, errorMessage: 'Indtast venligst et navn'})
    }
    if (chatNavn.length > MAX_CHARACTERS) {
        return res.render('chatsView', {authLevel: req.session.authLevel, chats: chatArr, errorMessage: 'Navnet er for langt'})
    }
    if (chatNavn.length < MIN_CHARACTERS) {
        return res.render('chatsView', {authLevel: req.session.authLevel, chats: chatArr, errorMessage: 'Navnet er for kort'})
    }
    let ejerNavn = req.session.username
    let id = generateUniqueId('CHAT')
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
    const chat = chats.find(c => Number(c.id) === Number(chatId))
    
    res.render('chatDetailView', {chat: chat, isKnownUser: req.session.isLoggedIn})
}

export const getChatMessages = (req, res) => {
    const chatId = Number(req.params.id)
    let chats = læsJSON(CHAT_FIL)
    const chat = chats.find(c => Number(c.id) === Number(chatId))
    
    res.render('chatMessageListView', {chat: chat, isKnownUser: req.session.isLoggedIn, username: req.session.username})
}

export const getDetailedChatMessage = (req, res) => {
    const messageId = Number(req.params.id)
    const message = læsJSON(BESKED_FIL).find(besked => besked.id === messageId)
    
    res.render('messageDetailView', {besked: message})
}

export const deleteChat = async (req, res) => {
    const chatId = Number(req.params.id)
    handleChatDeletion(chatId)
    res.redirect('/chats')
}

export const editChat = (req, res) => {
    const chatId = Number(req.params.id)
    const chat = getChatFromChatId(chatId)
    res.render('chatEditView', {chat: chat, isKnownUser: req.session.isLoggedIn})
}

export const updateChat = (req, res) => {
    const newName = req.body.newName
    const chatId = req.body.chatId
    const chat = getChatFromChatId(chatId)
    const chatMessages = chat.beskeder
    let updatedChat = new Chat(
        chatId,
        newName,
        chat.dato,
        chat.ejer
    )
    updatedChat.beskeder = chatMessages
    handleChatUpdate(updatedChat);
    res.redirect('/chats')
}


