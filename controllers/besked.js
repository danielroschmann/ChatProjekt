import Besked from "../models/Besked.js"
import { BESKED_FIL, læsJSON, CHAT_FIL, gemJSON, EJER_FIL } from "./filData.js"
import session from 'express-session'

export const getAllMessagesInChat = (req, res) => {
    const chatId = Number(req.params.id)
    let chats = læsJSON(CHAT_FIL)
    const chat = chats.find(c => c.id === chatId)
    console.log(chat)
    
    res.render('messages', {username: req.session.username,chat: chat, isKnownUser: req.session.isLoggedIn})
}

export const getSingleMessage = (req, res) => {
    const messageId = Number(req.params.id)
    let messageData = læsJSON(BESKED_FIL)
    const message = messageData.find(m => m.id === messageId)

    res.render('message', {besked: message, isKnownUser: req.session.isLoggedIn})
}

export const createMessage = async (req, res) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login')
    }
    let besked = req.body.besked;
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
    let dato = new Date().toLocaleString();
    
    let nyBesked = new Besked(id, besked, dato, ejer, chatId);
    
    let chat = chatArr.find(c => c.id == chatId);
    
    chat.beskeder.push(nyBesked);
    beskedArr.push(nyBesked); 

    await gemJSON(CHAT_FIL, chatArr);
    await gemJSON(BESKED_FIL, beskedArr);
    
    res.render('messages', {username: req.session.username, chat: chat, isKnownUser: req.session.isLoggedIn})
};


export const updateMessage = (req, res) => {
    // TODO
}

