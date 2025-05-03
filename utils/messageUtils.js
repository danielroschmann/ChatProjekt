import { læsJSON, gemJSON, BESKED_FIL } from "./jsonUtils.js"

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