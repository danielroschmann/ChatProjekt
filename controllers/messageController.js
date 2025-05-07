import Message from "../models/messageModel.js"
import { handleChatUpdate, getChatFromChatId } from "../utils/chatUtils.js"
import { generateUniqueId } from "../utils/helperUtils.js"
import { BESKED_FIL, læsJSON, CHAT_FIL, gemJSON, EJER_FIL } from "../utils/jsonUtils.js"
import { getMessageFromMessageId, handleMessageCreation, handleMessageUpdate } from "../utils/messageUtils.js"

export const getAllMessagesInChat = (req, res) => {
    const chatId = Number(req.params.id)
    let chats = læsJSON(CHAT_FIL)
    const chat = chats.find(c => Number(c.id) === Number(chatId))
    const beskeder = chat.beskeder
    
    res.render('chatMessageListView', {username: req.session.username, beskeder: beskeder, chat: chat, isKnownUser: req.session.isLoggedIn})
}

export const getSingleMessage = (req, res) => {
    const messageId = Number(req.params.id)
    let messageData = læsJSON(BESKED_FIL)
    const message = messageData.find(m => m.id === messageId)

    res.render('messageDetailView', {message: message, isKnownUser: req.session.isLoggedIn})
}

export const createMessage = async (req, res) => {
    let chatId = req.body.chatId;
    let message = req.body.message.trim();
    let username = req.session.username
    if (!req.session.isLoggedIn) {
        return res.redirect('/login')
    }
    if (message === undefined || message === '') {
        return res.redirect('chatMessageListView')
    }
    handleMessageCreation(message, chatId, username)

    res.redirect('/chats/' + chatId + '/messages')
};


export const editMessage = (req, res) => {
    const messageId = Number(req.params.id)
    const message = getMessageFromMessageId(messageId)
    res.render('messageEditView', {message: message, username: req.session.username})
}

export const updateMessage = (req, res) => {
    const messageId = Number(req.params.id);
    const newText = req.body.newMessage;

    const oldMessage = getMessageFromMessageId(messageId)

    const chatObject = getChatFromChatId(oldMessage.chatId)
    const chatIndex = læsJSON(CHAT_FIL).findIndex(c => c.id === oldMessage.chatId)
    const chatObjectMessages = chatObject.beskeder

    const updatedMessage = new Message(
        messageId,
        newText,
        oldMessage.dato,
        oldMessage.ejer,
        oldMessage.chatId
    );

    handleMessageUpdate(updatedMessage)

    const updatedChatMessages = chatObjectMessages.filter(m => Number(m.id) !== Number(messageId));
    updatedChatMessages.push(updatedMessage);
    chatObject.beskeder = updatedChatMessages;

    handleChatUpdate(chatObject, chatIndex)

    res.redirect(`/chats/${updatedMessage.chatId}/messages`);
};

export const deleteMessage = (req, res) => {
    const messageId = Number(req.params.id)
    const message = getMessageFromMessageId(messageId)
    const chatObject = getChatFromChatId(message.chatId)
    const chatIndex = læsJSON(CHAT_FIL).findIndex(c => c.id === message.chatId)
    const messageArr = læsJSON(BESKED_FIL)
    const updatedMessages = messageArr.filter(m => Number(m.id) !== Number(messageId));
    gemJSON(BESKED_FIL, updatedMessages);
    const chatObjectMessages = chatObject.beskeder
    const updatedChatMessages = chatObjectMessages.filter(m => Number(m.id) !== Number(messageId));
    chatObject.beskeder = updatedChatMessages;
    handleChatUpdate(chatObject, chatIndex)
    res.redirect(`/chats/${message.chatId}/messages`);
}






