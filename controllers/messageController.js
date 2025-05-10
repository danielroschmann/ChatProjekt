import Message from "../models/messageModel.js"
import { handleChatUpdate, getChatFromChatId } from "../utils/chatUtils.js"
import { generateUniqueId } from "../utils/helperUtils.js"
import { BESKED_FIL, læsJSON, CHAT_FIL, gemJSON, EJER_FIL } from "../utils/jsonUtils.js"
import { getMessageFromMessageId, handleMessageCreation, handleMessageDeletion, handleMessageUpdate } from "../utils/messageUtils.js"

export const getAllMessagesInChat = async (req, res) => {
    const chatId = String(req.params.id)
    
    let chats = læsJSON(CHAT_FIL)
    let alleBeskeder = læsJSON(BESKED_FIL)
    
    const chat = await getChatFromChatId(chatId)
    if (!chat) {
        return res.status(404).send("Chat ikke fundet")
    }
    
    
    // Dette sikrer at vi bruger de seneste data
    const chatBeskeder = alleBeskeder.filter(besked => String(besked.chatId) === chatId)
    
    // Sorter beskederne efter dato for at sikre de vises i rækkefølge
    chatBeskeder.sort((a, b) => new Date(a.dato) - new Date(b.dato))
    
    // Opdater chat objektet med de seneste beskeder
    chat.beskeder = chatBeskeder
    
    res.render('chatMessageListView', {
        username: req.session.username, 
        beskeder: chatBeskeder, 
        chat: chat, 
        isKnownUser: req.session.isLoggedIn})
}

export const getSingleMessage = (req, res) => {
    const messageId = String(req.params.id)
    let messageData = læsJSON(BESKED_FIL)
    const message = messageData.find(m => String(m.id) === messageId)

    if (!message) {
        return res.status(404).send("Besked ikke fundet")
    }

    res.render('messageDetailView', {besked: message, isKnownUser: req.session.isLoggedIn})
}

export const createMessage = async (req, res) => {
    let chatId = String(req.body.chatId);
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
    const messageId = String(req.params.id)
    const message = getMessageFromMessageId(messageId)
    
    if (!message) {
        return res.status(404).send("Besked ikke fundet")
    }
    
    res.render('messageEditView', {message: message, username: req.session.username})
}

export const updateMessage = async (req, res) => {
    const messageId = req.params.id;
    const newText = req.body.tekst;

    const oldMessage = getMessageFromMessageId(messageId);
    if (!oldMessage) {
        return res.status(404).json({ error: 'Message not found' });
    }

    const updatedMessage = new Message(
        messageId,
        newText,
        oldMessage.dato,
        oldMessage.ejer,
        oldMessage.chatId
    );

    try {
        await handleMessageUpdate(updatedMessage);
        res.status(200).json({ success: true, message: 'Message updated', data: updatedMessage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update message' });
    }
};

export const deleteMessage = (req, res) => {
    const messageId = String(req.params.id)

    handleMessageDeletion(messageId)

    return res.status(200).json({success: true, message: "besked slettet"})


}
