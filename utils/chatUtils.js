import { læsJSON} from "./jsonUtils.js";
import { CHAT_FIL, gemJSON, BESKED_FIL } from "./jsonUtils.js"

export const getChatFromChatId = (id) => {
    const allChat = læsJSON(CHAT_FIL)
    const chatObject = allChat.find(chat => Number(chat.id) === Number(id))
    return chatObject
}

export const handleChatUpdate = (updatedChat, index) => {
    const allChat = læsJSON(CHAT_FIL)
    const chatId = updatedChat.id
    const updatedChats = allChat.filter(chat => Number(chat.id) !== Number(chatId));
    updatedChats.splice(index, 0, updatedChat);
    gemJSON(CHAT_FIL, updatedChats);
}

export const handleChatDeletion = (chatId) => {
    const allChat = læsJSON(CHAT_FIL)
    const allMessages = læsJSON(BESKED_FIL)
    const updatedMessages = allMessages.filter(m => Number(m.chatId) !== Number(chatId));
    const updatedChats = allChat.filter(chat => Number(chat.id) !== Number(chatId));
    gemJSON(BESKED_FIL, updatedMessages);
    gemJSON(CHAT_FIL, updatedChats);
}