import { CHAT_FIL } from "../utils/jsonUtils.js"
import { læsJSON } from "../utils/jsonUtils.js"
import Chat from "../models/chatModel.js"
import { getChatFromChatId, handeChatCreation, handleChatDeletion, handleChatUpdate } from "../utils/chatUtils.js"
import { getMessageFromMessageId } from "../utils/messageUtils.js"

const MAX_CHARACTERS = 20
const MIN_CHARACTERS = 3

export const createChat = async (req, res) => {
    let chatName = req.body.chatNavn.trim()
    let ejerName = req.session.username
    let chatArr = læsJSON(CHAT_FIL)
    if (chatName === undefined  || chatName === '') {
        return res.render('chatsView', {authLevel: req.session.authLevel, chats: chatArr, errorMessage: 'Indtast venligst et navn'})
    }
    if (chatName.length > MAX_CHARACTERS) {
        return res.render('chatsView', {authLevel: req.session.authLevel, chats: chatArr, errorMessage: 'Navnet er for langt'})
    }
    if (chatName.length < MIN_CHARACTERS) {
        return res.render('chatsView', {authLevel: req.session.authLevel, chats: chatArr, errorMessage: 'Navnet er for kort'})
    }
    handeChatCreation(chatName, ejerName)
    res.redirect('/chats')
}


export const getChat = (req, res) => {
    let chats = læsJSON(CHAT_FIL)
    res.render('chatsView', {username: req.session.username, chats: chats, isKnownUser: req.session.isLoggedIn, authLevel: req.session.authLevel})
}

export const getSingleChat = (req, res) => {
    const chatId = Number(req.params.id)
    const chat = getChatFromChatId(chatId)
    
    res.render('chatDetailView', {chat: chat, isKnownUser: req.session.isLoggedIn})
}

export const getChatMessages = (req, res) => {
    const chatId = Number(req.params.id)
    const chat = getChatFromChatId(chatId)
    
    res.render('chatMessageListView', {chat: chat, isKnownUser: req.session.isLoggedIn, username: req.session.username})
}

export const getDetailedChatMessage = (req, res) => {
    const messageId = Number(req.params.id)
    const message = getMessageFromMessageId(messageId)
    
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
    const chatIndex = læsJSON(CHAT_FIL).findIndex(c => c.id === chatId)
    const chatMessages = chat.beskeder
    let updatedChat = new Chat(
        chatId,
        newName,
        chat.dato,
        chat.ejer
    )
    updatedChat.beskeder = chatMessages
    handleChatUpdate(updatedChat, chatIndex);
    res.redirect('/chats')
}


