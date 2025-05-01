import Besked from "../models/messageModel.js"
import { BESKED_FIL, læsJSON, CHAT_FIL, gemJSON, EJER_FIL } from "./fileStorageController.js"
import session from 'express-session'

export const getAllMessagesInChat = (req, res) => {
    const chatId = Number(req.params.id)
    let chats = læsJSON(CHAT_FIL)
    const chat = chats.find(c => c.id === chatId)
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
    console.log("Hentet chatId: " + chatId)
    
    let chatArr = læsJSON(CHAT_FIL);
    console.log(chatArr)
    let beskedArr = læsJSON(BESKED_FIL);

    if (beskedArr === undefined) {
        beskedArr = []
    }
    
    let id = beskedArr.length > 0 ? beskedArr[beskedArr.length - 1].id + 1 : 1; // korrekt ID
    let tidspunkt = [new Date().toLocaleDateString(), new Date().toLocaleTimeString()];
    
    let nyBesked = new Besked(id, besked, tidspunkt, ejer, chatId);
    
    let chat = chatArr.find(c => c.id == chatId);
    let beskeder = chat.beskeder;
    
    chat.beskeder.push(nyBesked);
    beskedArr.push(nyBesked); 

    await gemJSON(CHAT_FIL, chatArr);
    await gemJSON(BESKED_FIL, beskedArr);
    
    res.render('chatMessageListView', {username: req.session.username, beskeder: beskeder, chat: chat, isKnownUser: req.session.isLoggedIn})
};


export const editMessage = (req, res) => {
    const messageId = Number(req.params.id)
    const message = getSpecificMessage(messageId)
    res.render('messageEditView', {message: message, username: req.session.username})
}

export const updateMessage = (req, res) => {
    const messageId = Number(req.params.id);
    const newText = req.body.newMessage;

    const allMessages = læsJSON(BESKED_FIL);
    const oldMessage = allMessages.find(m => m.id === messageId);

    if (!oldMessage) {
        return res.status(404).send("Besked ikke fundet");
    }

    const allChat = læsJSON(CHAT_FIL)
    const chatObject = allChat.find(chat => Number(chat.id) === Number(oldMessage.chatId))

    if (!chatObject) {
        return res.status(404).send("Chat ikke fundet")
    }

    const chatObjectMessages = chatObject.beskeder

    const updatedMessage = new Besked(
        messageId,
        newText,
        oldMessage.dato,
        oldMessage.ejer,
        oldMessage.chatId
    );

    const updatedMessages = allMessages.filter(m => Number(m.id) !== Number(messageId));
    updatedMessages.push(updatedMessage);
    gemJSON(BESKED_FIL, updatedMessages);


    const updatedChatMessages = chatObjectMessages.filter(m => Number(m.id) !== Number(messageId));
    updatedChatMessages.push(updatedMessage);
    chatObject.beskeder = updatedChatMessages;

    const updatedChats = allChat.filter(chat => Number(chat.id) !== Number(oldMessage.chatId))
    updatedChats.push(chatObject)
    gemJSON(CHAT_FIL, updatedChats);

    res.redirect(`/chats/${updatedMessage.chatId}/messages`);
};



const getSpecificMessage = (id) => {
    const messageArr = læsJSON(BESKED_FIL)
    const message = messageArr.find(message => message.id === id)
    return message
}

