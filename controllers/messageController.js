import Message from "../models/messageModel.js"
import { handleChatUpdate, getChatFromChatId } from "../utils/chatUtils.js"
import { generateUniqueId } from "../utils/helperUtils.js"
import { BESKED_FIL, læsJSON, CHAT_FIL, gemJSON, EJER_FIL } from "../utils/jsonUtils.js"
import { getMessageFromMessageId, handleMessageCreation, handleMessageUpdate } from "../utils/messageUtils.js"

export const getAllMessagesInChat = (req, res) => {
    const chatId = Number(req.params.id)
    
    let chats = læsJSON(CHAT_FIL)
    let alleBeskeder = læsJSON(BESKED_FIL)
    
    const chat = chats.find(c => c.id === chatId)
    if (!chat) {
        return res.status(404).send("Chat ikke fundet")
    }
    
    
    // Dette sikrer at vi bruger de seneste data
    const chatBeskeder = alleBeskeder.filter(besked => Number(besked.chatId) === chatId)
    
    // Sorter beskederne efter id for at sikre de vises i rækkefølge
    chatBeskeder.sort((a, b) => a.id - b.id)
    
    // Opdater chat objektet med de seneste beskeder
    chat.beskeder = chatBeskeder
    
    res.render('chatMessageListView', {
        username: req.session.username, 
        beskeder: chatBeskeder, 
        chat: chat, 
        isKnownUser: req.session.isLoggedIn})
}

export const getSingleMessage = (req, res) => {
    const messageId = Number(req.params.id)
    let messageData = læsJSON(BESKED_FIL)
    const message = messageData.find(m => m.id === messageId)

    if (!message) {
        return res.status(404).send("Besked ikke fundet")
    }

    res.render('messageDetailView', {besked: message, isKnownUser: req.session.isLoggedIn})
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
    let ejer = læsJSON(EJER_FIL).find(u => u.navn === req.session.username);
    let chatId = Number(req.body.chatId);
    console.log("Hentet chatId: " + chatId)
    
    let chatArr = læsJSON(CHAT_FIL);
    console.log(chatArr)
    let beskedArr = læsJSON(BESKED_FIL);

    if (beskedArr === undefined) {
        beskedArr = []
    }
    
    let id = beskedArr.length > 0 ? beskedArr[beskedArr.length - 1].id + 1 : 1; // korrekt ID
    let tidspunkt = [new Date().toLocaleDateString(), new Date().toLocaleTimeString()];
    
    let nyBesked = new Message(id, besked, tidspunkt, ejer, chatId);
    
    let chat = chatArr.find(c => c.id == chatId);
    
    if (!chat) {
        return res.status(404).send("Chat ikke fundet")
    }
    
    // Tilføj den nye besked til besked-array
    beskedArr.push(nyBesked); 
    
    // Find alle beskeder der tilhører denne chat
    const chatBeskeder = beskedArr.filter(besked => Number(besked.chatId) === chatId)
    
    // Opdater chat objektet med de seneste beskeder
    chat.beskeder = chatBeskeder;

    await gemJSON(CHAT_FIL, chatArr);
    await gemJSON(BESKED_FIL, beskedArr);
    
    res.render('chatMessageListView', {
        username: req.session.username, 
        beskeder: chatBeskeder, 
        chat: chat, 
        isKnownUser: req.session.isLoggedIn
    })
};

export const editMessage = (req, res) => {
    const messageId = Number(req.params.id)
    const message = getSpecificMessage(messageId)
    
    if (!message) {
        return res.status(404).send("Besked ikke fundet")
    }
    
    res.render('messageEditView', {message: message, username: req.session.username})
}

export const updateMessage = (req, res) => {
    const messageId = Number(req.params.id);
    const newText = req.body.besked;


    // Find den gamle besked
    const oldMessage = getSpecificMessage(messageId);
    if (!oldMessage) {
        return res.status(404).json({ error: 'Besked ikke fundet' });
    }

    const chatId = Number(oldMessage.chatId);

    // Opret en ny Message-objekt med opdateret tekst
    const updatedMessage = new Message(
        messageId,
        newText,
        oldMessage.dato,
        oldMessage.ejer,
        chatId
    );

    // Opdater besked-array
    let alleBeskeder = læsJSON(BESKED_FIL);
    const opdateretBeskeder = alleBeskeder.filter(m => Number(m.id) !== messageId);
    opdateretBeskeder.push(updatedMessage);
    gemJSON(BESKED_FIL, opdateretBeskeder);

    // Opdater chat-objektet med de opdaterede beskeder
    let alleChats = læsJSON(CHAT_FIL);
    const chat = alleChats.find(c => Number(c.id) === chatId);
    
    if (chat) {
        // Find alle beskeder der tilhører denne chat (fra det opdaterede besked-array)
        const chatBeskeder = opdateretBeskeder.filter(besked => Number(besked.chatId) === chatId);
        // Opdater chat-objektets beskeder
        chat.beskeder = chatBeskeder;
        
        // Gem det opdaterede chat-array
        gemJSON(CHAT_FIL, alleChats);
    }

    // Return en succesfuld response med det opdaterede besked-data
    res.status(200).json({ 
        success: true, 
        message: 'Besked opdateret', 
        data: updatedMessage 
    });
    
};

const getSpecificMessage = (id) => {
    const messageArr = læsJSON(BESKED_FIL)
    const message = messageArr.find(message => Number(message.id) === Number(id))
    return message
}

const getChatFromChatId = (id) => {
    const alleBeskeder = læsJSON(CHAT_FIL)
    const chatObject = alleBeskeder.find(chat => Number(chat.id) === Number(id))
    return chatObject
}

export const deleteMessage = (req, res) => {
    const messageId = Number(req.params.id)

    const alleBeskeder = læsJSON(BESKED_FIL)
    const sletBesked = alleBeskeder.find(m => Number(m.id) === messageId)

    if (!sletBesked) {
        return res.status(404).json({error: `${messageId} ikke fundet`})
    }

    const opdateredBeskeder = alleBeskeder.filter(m => Number(m.id) !== messageId)
    gemJSON(BESKED_FIL, opdateredBeskeder)

    const chatId = sletBesked.chatId
    const alleChats = læsJSON(CHAT_FIL)
    const chat = alleChats.find(c => Number(c.id) === chatId)

    if (chat) {
        chat.beskeder = opdateredBeskeder.filter(m => Number(m.chatId) === Number(chatId))
        gemJSON(CHAT_FIL, alleChats)
    }

    return res.status(200).json({success: true, message: "besked slettet"})


}