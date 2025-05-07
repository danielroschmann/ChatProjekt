import Message from "../models/messageModel.js"
import { handleChatUpdate, getChatFromChatId } from "../utils/chatUtils.js"
import { generateUniqueId } from "../utils/helperUtils.js"
import { BESKED_FIL, læsJSON, CHAT_FIL, gemJSON, EJER_FIL } from "../utils/jsonUtils.js"
import { getMessageFromMessageId, handleMessageCreation, handleMessageDeletion, handleMessageUpdate } from "../utils/messageUtils.js"

export const getAllMessagesInChat = async (req, res) => {
    const chatId = Number(req.params.id)
    
    let chats = læsJSON(CHAT_FIL)
    let alleBeskeder = læsJSON(BESKED_FIL)
    
    const chat = await getChatFromChatId(chatId)
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
    handleMessageCreation(message, chatId, username)
    res.redirect(`/chats/${chatId}/messages`)
};

export const editMessage = (req, res) => {
    const messageId = Number(req.params.id)
    const message = getMessageFromMessageId(messageId)
    
    if (!message) {
        return res.status(404).send("Besked ikke fundet")
    }
    
    res.render('messageEditView', {message: message, username: req.session.username})
}

export const updateMessage = (req, res) => {
    const messageId = Number(req.params.id);
    const newText = req.body.updatedMessage;


    // Find den gamle besked
    const oldMessage = getMessageFromMessageId(messageId);
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

    handleMessageUpdate(updatedMessage);

    // Return en succesfuld response med det opdaterede besked-data
    res.status(200).json({ 
        success: true, 
        message: 'Besked opdateret', 
        data: updatedMessage 
    });
    
};

export const deleteMessage = (req, res) => {
    const messageId = Number(req.params.id)

    handleMessageDeletion(messageId)

    return res.status(200).json({success: true, message: "besked slettet"})


}