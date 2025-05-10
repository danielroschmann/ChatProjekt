import { læsJSON} from "./jsonUtils.js";
import { CHAT_FIL, gemJSON, BESKED_FIL, EJER_FIL } from "./jsonUtils.js"
import { generateUniqueId } from "./helperUtils.js";
import Chat from "../models/chatModel.js";

export const getChatFromChatId = (id) => {
    console.log(`Fetching chat with ID: ${id}`);
    const allChat = læsJSON(CHAT_FIL);
    console.log(`Total chats available: ${allChat.length}`);
    const chatObject = allChat.find(chat => JSON.stringify(chat.id) === JSON.stringify(id));
    if (!chatObject) {
        console.log(`Chat with ID ${id} not found`);
    }
    return chatObject;
}

export const handleChatUpdate = (updatedChat, index) => {
    console.log(`Attempting to update chat with ID: ${updatedChat.id}`);
    const allChat = læsJSON(CHAT_FIL)
    const chatId = updatedChat.id
    console.log(`Total chats before update: ${allChat.length}`);
    const updatedChats = allChat.filter(chat => String(chat.id) !== String(chatId));
    console.log(`Total chats after removal of old chat: ${updatedChats.length}`);
    updatedChats.splice(index, 0, updatedChat);
    console.log(`Total chats after update: ${updatedChats.length}`);
    gemJSON(CHAT_FIL, updatedChats);
    console.log(`Chat update successful`);
}

export const handleChatDeletion = (chatId) => {
    console.log(`Attempting to delete chat with ID: ${chatId}`);
    const allChat = læsJSON(CHAT_FIL);
    const allMessages = læsJSON(BESKED_FIL);
    
    console.log(`Total chats before deletion: ${allChat.length}`);
    console.log(`Total messages before deletion: ${allMessages.length}`);
    
    const updatedMessages = allMessages.filter(m => String(m.chatId) !== String(chatId));
    const updatedChats = allChat.filter(chat => String(chat.id) !== String(chatId));
    
    console.log(`Total chats after deletion: ${updatedChats.length}`);
    console.log(`Total messages after deletion: ${updatedMessages.length}`);
    
    gemJSON(BESKED_FIL, updatedMessages);
    gemJSON(CHAT_FIL, updatedChats);
    console.log(`Chat with ID: ${chatId} has been deleted successfully.`);
}

export const handeChatCreation = (chatName, chatOwner) => {
    console.log("Trying to create chat", chatName, "with owner", chatOwner);
    const allChat = læsJSON(CHAT_FIL)
    const id = generateUniqueId();
    const date = new Date().toLocaleDateString();
    const owner = læsJSON(EJER_FIL).find(e => e.navn === chatOwner);
    console.log("Found owner:", owner);
    const newChat = new Chat(id, chatName, date, owner);
    console.log("Created new chat:", newChat);
    allChat.push(newChat);
    console.log("Updated chat list:", allChat);
    gemJSON(CHAT_FIL, allChat);
    console.log("Chat created successfully");
}
