import { læsJSON } from "../utils/jsonUtils.js"
import { EJER_FIL, BESKED_FIL } from "../utils/jsonUtils.js"
import { checkCredentials, inputIsBlank, usernameIsValid, getAuthentificationLevel } from "../utils/authUtils.js"
import { getUserByUserId, getUserByUsername, handlePasswordUpdate, handleUserCreation, handleUserAuthUpdate } from "../utils/userUtils.js"

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
    if (!usernameIsValid(username)) {
        return res.render('registerView', {errorMessage: 'Brugernavnet er allerede taget'})
    }
    await handleUserCreation(username, password)
    const authLevel = getAuthentificationLevel(username)
    req.session.isLoggedIn = true
    req.session.username = username
    req.session.authLevel = authLevel
    res.redirect('/chats')
}


export const getSingleUser = (req, res) => {
    const userId = req.params.id
    const user = getUserByUserId(userId)
    res.render('userDetailView', {user: user, isKnownUser: req.session.isLoggedIn})
}

export const getAllUsers = (req, res) => {
    let users = læsJSON(EJER_FIL)
    res.render('usersView', {username: req.session.username, users: users, isKnownUser: req.session.isLoggedIn})
}

export const signUp = (req, res) => {
    res.render('registerView')
}

export const getUserMessages = (req, res) => {
    let beskeder = læsJSON(BESKED_FIL)
    const userId = req.params.id
    const user = getUserByUserId(userId)
    beskeder = beskeder.filter(b => b.ejer.id === userId)
    if (beskeder === undefined) {
        beskeder = []
    }
    res.render('chatMessageListView', {beskeder: beskeder, user: user, isKnownUser: req.session.isLoggedIn, viewMode: true})
}

export const getUserProfile = (req, res) => {
    const username = req.session.username
    const user = getUserByUsername(username)
    res.render('userDetailView', {user: user, profileView: true, isKnownUser: req.session.isLoggedIn})
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
    handlePasswordUpdate(username, newPassword)
    console.log(`Password for user ${username} updated`)
    res.status(200).send('Kodeord opdateret');
}

export const updateAuthLevel = async (req, res) => {
    const { id, authLevel } = req.body
    try {
        await handleUserAuthUpdate(id, authLevel)
        res.status(200).send('Rettigheder opdateret')
    } catch (error) {
        console.error(error)
        res.status(500).send('Kunne ikke opdatere rettigheder')
    }
}