import { gemJSON, læsJSON } from "./jsonUtils.js"
import { EJER_FIL } from "./jsonUtils.js"
import bcrypt from 'bcrypt'
import User from "../models/userModel.js"
import { generateUniqueId } from "./helperUtils.js"
export const handleUserCreation = async (username, password) => {
    const date = new Date().toLocaleDateString()
    let users = læsJSON(EJER_FIL)
    const id = generateUniqueId()
    try {
        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User(id, username, hashPassword, date, 1)
        users.push(user)
        await gemJSON(EJER_FIL, users)
    } catch (error) {
        console.error("Kunne ikke oprette bruger: " + error)
    }
}

export const handlePasswordUpdate = async (username, newPassword) => {
    let users = læsJSON(EJER_FIL)
    const user = getUserByUsername(username)
    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword
    gemJSON(EJER_FIL, users)
}

export const getUserByUsername = (username) => {
    let users = læsJSON(EJER_FIL)
    return users.find(b => b.navn === username)
}

export const getUserByUserId = (userId) => {
    let users = læsJSON(EJER_FIL)
    return users.find(b => b.id === userId)
}