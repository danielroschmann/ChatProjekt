import { læsJSON, gemJSON, BESKED_FIL, EJER_FIL, CHAT_FIL } from "./jsonUtils.js"
import Message from "../models/messageModel.js"
import { generateUniqueId } from "./helperUtils.js"
import { handleChatUpdate, getChatFromChatId } from "./chatUtils.js"

export const handleMessageUpdate = async (updatedMessage) => {
    console.log(`Attempting to update message with ID: ${updatedMessage.id}`);
    console.log('Fetching all messages...');
    const allMessages = læsJSON(BESKED_FIL);

    console.log('Fetching all chats...');
    const allChats = læsJSON(CHAT_FIL);

    const chat = allChats.find(c => c.id === updatedMessage.chatId);
    const chatMessages = chat.beskeder

    chat.beskeder = chatMessages.filter(m => String(m.id) !== String(updatedMessage.id));
    chat.beskeder.push(updatedMessage);

    handleChatUpdate(chat, chatMessages.findIndex(c => c.id === chat.id));
    console.log(`Total messages before update: ${allMessages.length}`);
    const messageId = updatedMessage.id;
    const updatedMessages = allMessages.filter(m => String(m.id) !== String(messageId));
    updatedMessages.push(updatedMessage);
    gemJSON(BESKED_FIL, updatedMessages);
    console.log(`Total messages after update: ${updatedMessages.length}`);
    console.log(`Message with ID: ${messageId} updated successfully.`);
}

export const getMessageFromMessageId = (messageId) => {
    const allMessages = læsJSON(BESKED_FIL)
    return allMessages.find(m => String(m.id) === String(messageId))
}

export const handleMessageDeletion = (messageId) => {
    console.log(`Attempting to delete message with ID: ${messageId}`);
    const allMessages = læsJSON(BESKED_FIL);
    
    const updatedMessages = allMessages.filter(m => String(m.id) !== String(messageId));
    
    gemJSON(BESKED_FIL, updatedMessages);
    console.log(`Message with ID: ${messageId} has been deleted successfully.`);
}

export const handleMessageCreation = async (message, chatId, username) => {
    console.log(`Attempting to create message with message: ${message}, chatId: ${chatId}, and username: ${username}`);
    let ejer = læsJSON(EJER_FIL).find(u => u.navn === username);
    let id = generateUniqueId();
    let date = [new Date().toLocaleDateString(), new Date().toLocaleTimeString()];
        
    let messageObject = new Message(id, message, date, ejer, chatId);
        
    let beskedArr = læsJSON(BESKED_FIL);
    let chat = getChatFromChatId(chatId);
    const chatIndex = læsJSON(CHAT_FIL).findIndex(c => c.id === chatId);
    const chatMessages = chat.beskeder
    chatMessages.push(messageObject);
    chat.beskeder = chatMessages;
    beskedArr.push(messageObject); 
    console.log(`Attempting to save message to beskedArr: ${JSON.stringify(beskedArr)}`);
    await gemJSON(BESKED_FIL, beskedArr);
        
    console.log(`Attempting to update chat with ID: ${chatId}`);
    handleChatUpdate(chat, chatIndex);
    console.log(`Message created successfully`);
}
