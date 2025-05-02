import { EJER_FIL, læsJSON, CHAT_FIL, BESKED_FIL } from "./jsonUtils.js"

export const generateUniqueId = (modelType) => {
    switch (modelType) {
        case 'USER': {
            const userArr = læsJSON(EJER_FIL)
            return userArr.length > 0 ? userArr[userArr.length - 1].id + 1 : 1
        }
        case 'CHAT': {
            const chatArr = læsJSON(CHAT_FIL)
            return chatArr.length > 0 ? chatArr[chatArr.length - 1].id + 1 : 1
        }
        case 'MESSAGE': {
            const messageArr = læsJSON(BESKED_FIL)
            return messageArr.length > 0 ? messageArr[messageArr.length - 1].id + 1 : 1
        }
        default: {
            throw new Error('Invalid model type')
        }
    }
}