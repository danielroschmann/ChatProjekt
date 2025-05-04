import Message from "../models/messageModel.js"
import { handleChatUpdate, getChatFromChatId } from "../utils/chatUtils.js"
import { generateUniqueId } from "../utils/helperUtils.js"
import { BESKED_FIL, læsJSON, CHAT_FIL, gemJSON, EJER_FIL } from "../utils/jsonUtils.js"
import { getMessageFromMessageId, handleMessageUpdate } from "../utils/messageUtils.js"

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

    res.render('messageDetailView', {besked: message, isKnownUser: req.session.isLoggedIn})
}

export const createMessage = async (req, res) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login')
    }
    let besked = req.body.besked.trim();
    if (besked === undefined || besked === '') {
        return res.redirect('chatMessageListView')
    }
    let ejer = læsJSON(EJER_FIL).find(u => u.navn === req.session.username);
    let chatId = req.body.chatId;
    let id = generateUniqueId('MESSAGE');
    let tidspunkt = [new Date().toLocaleDateString(), new Date().toLocaleTimeString()];
    
    let nyBesked = new Message(id, besked, tidspunkt, ejer, chatId);
    
    let beskedArr = læsJSON(BESKED_FIL);

    let chat = getChatFromChatId(chatId);
    let beskeder = chat.beskeder;
    chat.beskeder.push(nyBesked);
    beskedArr.push(nyBesked); 
    await gemJSON(BESKED_FIL, beskedArr);
    
    handleChatUpdate(chat);
    
    res.render('chatMessageListView', {username: req.session.username, beskeder: beskeder, chat: chat, isKnownUser: req.session.isLoggedIn})
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

    handleChatUpdate(chatObject)

    res.redirect(`/chats/${updatedMessage.chatId}/messages`);
};

export const deleteMessage = (req, res) => {
    const messageId = Number(req.params.id)
    const message = getMessageFromMessageId(messageId)
    const chatObject = getChatFromChatId(message.chatId)
    const messageArr = læsJSON(BESKED_FIL)
    const updatedMessages = messageArr.filter(m => Number(m.id) !== Number(messageId));
    gemJSON(BESKED_FIL, updatedMessages);
    const chatObjectMessages = chatObject.beskeder
    const updatedChatMessages = chatObjectMessages.filter(m => Number(m.id) !== Number(messageId));
    chatObject.beskeder = updatedChatMessages;
    handleChatUpdate(chatObject)
    res.redirect(`/chats/${message.chatId}/messages`);
}






