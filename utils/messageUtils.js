import { læsJSON, gemJSON, BESKED_FIL, EJER_FIL, CHAT_FIL } from "./jsonUtils.js"
import Message from "../models/messageModel.js"
import { generateUniqueId } from "./helperUtils.js"
import { handleChatUpdate, getChatFromChatId } from "./chatUtils.js"

export const handleMessageUpdate = (updatedMessage) => {
    const allMessages = læsJSON(BESKED_FIL)
    const messageId = updatedMessage.id
    const updatedMessages = allMessages.filter(m => Number(m.id) !== Number(messageId));
    updatedMessages.push(updatedMessage);
    gemJSON(BESKED_FIL, updatedMessages);
}

export const getMessageFromMessageId = (messageId) => {
    const allMessages = læsJSON(BESKED_FIL)
    return allMessages.find(m => Number(m.id) === Number(messageId))
}

export const handleMessageDeletion = (messageId) => {
    const allMessages = læsJSON(BESKED_FIL)
    const updatedMessages = allMessages.filter(m => Number(m.id) !== Number(messageId));
    gemJSON(BESKED_FIL, updatedMessages);
}

export const handleMessageCreation = async (message, chatId, username) => {
    let ejer = læsJSON(EJER_FIL).find(u => u.navn === username);
    let id = generateUniqueId('MESSAGE');
    let date = [new Date().toLocaleDateString(), new Date().toLocaleTimeString()];
        
    let messageObject = new Message(id, message, date, ejer, chatId);
        
    let beskedArr = læsJSON(BESKED_FIL);
    let chat = getChatFromChatId(chatId);
    const chatIndex = læsJSON(CHAT_FIL).findIndex(c => c.id === chatId);
    const chatMessages = chat.beskeder
    chatMessages.push(messageObject);
    chat.beskeder = chatMessages;
    beskedArr.push(messageObject); 
    await gemJSON(BESKED_FIL, beskedArr);
        
    handleChatUpdate(chat, chatIndex);
}
