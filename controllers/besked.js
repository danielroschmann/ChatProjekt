import Besked from "../models/Besked.js"
import { BESKED_FIL, læsJSON, CHAT_FIL, gemJSON, EJER_FIL } from "./filData.js"
import session from 'express-session'

export const getAllMessagesInChat = (req, res) => {
    const chatId = Number(req.params.id)
    let chats = læsJSON(CHAT_FIL)
    const chat = chats.find(c => c.id === chatId)
    console.log(chat)
    
    res.render('messages', {chat: chat, isKnownUser: req.session.isLoggedIn})
}

export const getSingleMessage = (req, res) => {
    const beskedId = Number(req.params.id)
    let chats = læsJSON(CHAT_FIL)
    const chat = chats.find(c => c.id === 1) 
    const besked = chat.beskeder.find(b => b.id === beskedId)
    console.log(besked)

    res.render('message', {besked: besked, isKnownUser: req.session.isLoggedIn})
}

export const createMessage = (req, res) => {
    let besked = req.body.besked;
    let ejer = læsJSON(EJER_FIL).find(u => u.navn === req.session.username);
    let chatId = req.body.chatId;
    console.log("Hentet chatId: " + chatId)
    
    let chatArr = læsJSON(CHAT_FIL);
    console.log(chatArr)
    let beskedArr = læsJSON(BESKED_FIL);

    console.log(beskedArr.length)
    
    let id = beskedArr.length > 0 ? beskedArr[beskedArr.length - 1].id + 1 : 1; // korrekt ID
    let dato = new Date().toLocaleString(); // korrekt dato
    
    let nyBesked = new Besked(id, besked, dato, ejer, chatId);
    
    let chat = chatArr.find(c => c.id == chatId);
    console.log(chat)
    if (!chat) {
        return res.status(404).json({ error: "Chat ikke fundet" });
    }
    
    chat.beskeder.push(nyBesked);
    beskedArr.push(nyBesked); // husk også at gemme den i beskedfilen

    gemJSON(CHAT_FIL, chatArr);
    gemJSON(BESKED_FIL, beskedArr);
    
    res.redirect(`/chats/${chatId}/messages`)
};


export const updateMessage = (req, res) => {
    // TODO
}

