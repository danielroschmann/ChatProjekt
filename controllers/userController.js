import { gemJSON, læsJSON } from "../utils/jsonUtils.js"
import { EJER_FIL, BESKED_FIL } from "../utils/jsonUtils.js"
import User from "../models/userModel.js"
import bcrypt from 'bcrypt'
import { generateUniqueId } from "../utils/helperUtils.js"
import { checkCredentials, inputIsBlank, usernameIsValid } from "../utils/authUtils.js"

export const createUser = async (req, res) => {
    const username = req.body.username.trim()
    const password = req.body.password.trim()
    if (inputIsBlank(username, password)) {
        return res.render('registerView', {errorMessage: 'Indtast venligst et brugernavn og et kodeord'})
    }
    if (password.length < 8) {
        return res.render('registerView', {errorMessage: 'Kodeordet er for kort'})
    }
    if (password.length > 20) {
        return res.render('registerView', {errorMessage: 'Kodeordet er for langt'})
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

export const changePassword = (req, res) => {
    res.render('changePasswordView', {username: req.session.username, isKnownUser: req.session.isLoggedIn})
}

export const updatePassword = async (req, res) => {
    const {oldPassword, newPassword} = req.body
    const username = req.session.username
    const password = await checkCredentials(username, oldPassword)
    if (!password) {
        console.error('Forkert kodeord')
        res.status(403).send('Forkert adgangskode');
        return
    } 
    let brugere = læsJSON(EJER_FIL)
        const bruger = brugere.find(b => b.navn === username)
        const hashPassword = await bcrypt.hash(newPassword, 10);
        bruger.password = hashPassword
        gemJSON(EJER_FIL, brugere)
        console.log(`Password for user ${username} updated`)
        res.status(200).send('Kodeord opdateret');
}