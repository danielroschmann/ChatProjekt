import { gemJSON, læsJSON } from "../utils/jsonUtils.js"
import { EJER_FIL, BESKED_FIL } from "../utils/jsonUtils.js"
import User from "../models/userModel.js"
import bcrypt from 'bcrypt'
import { generateUniqueId } from "../utils/helperUtils.js"
import { inputIsBlank, usernameIsValid } from "../utils/authUtils.js"

export const createUser = async (req, res) => {
    const username = req.body.username.trim()
    const password = req.body.password.trim()
    if (inputIsBlank(username, password)) {
        return res.render('registerView', {errorMessage: 'Indtast venligst et brugernavn og et kodeord'})
    }

    const dato = new Date().toLocaleDateString()
    let brugere = læsJSON(EJER_FIL)
    const id = generateUniqueId()
    if (!usernameIsValid(username)) {
        return res.render('registerView', {errorMessage: 'Brugernavnet er allerede taget'})
    }

    try {
        const hashPassword = await bcrypt.hash(password, 10);
        const bruger = new User(id, username, hashPassword, dato, 1)
        brugere.push(bruger)
        await gemJSON(EJER_FIL, brugere)
        res.render('loginView')
    } catch (error) {
        res.render('registerView', { errorMessage: 'Noget gik galt. Prøv igen.' })
    
    }
    
    
}


export const getSingleUser = (req, res) => {
    let brugere = læsJSON(EJER_FIL)
    const userId = req.params.id
    const bruger = brugere.find(b => b.id === userId)
    res.render('userDetailView', {bruger: bruger, isKnownUser: req.session.isLoggedIn})
}

export const getAllUsers = (req, res) => {
    let brugere = læsJSON(EJER_FIL)
    res.render('usersView', {brugere: brugere, isKnownUser: req.session.isLoggedIn})
}

export const signUp = (req, res) => {
    res.render('registerView')
}

export const getUserMessages = (req, res) => {
    let brugere = læsJSON(EJER_FIL)
    let beskeder = læsJSON(BESKED_FIL)
    const userId = req.params.id
    const bruger = brugere.find(b => b.id === userId)
    beskeder = beskeder.filter(b => b.ejer.id === userId)
    if (beskeder === undefined) {
        beskeder = []
    }
    res.render('chatMessageListView', {beskeder: beskeder, bruger: bruger, isKnownUser: req.session.isLoggedIn, viewMode: true})
}

export const getUserProfile = (req, res) => {
    const username = req.session.username
    const user = læsJSON(EJER_FIL).find(b => b.navn === username)
    res.render('userDetailView', {bruger: user, profileView: true, isKnownUser: req.session.isLoggedIn})
}

