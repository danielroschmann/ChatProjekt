import { gemJSON, læsJSON } from "./fileStorageController.js"
import { EJER_FIL, BESKED_FIL } from "./fileStorageController.js"
import User from "../models/userModel.js"

export const createUser = async (req, res) => {
<<<<<<< HEAD:controllers/bruger.js
    const {username, password} = req.body
=======
    const username = req.body.username.trim()
    const password = req.body.password.trim()
    if (username.trim() === '' || password.trim() === '') {
        return res.render('registerView', {errorMessage: 'Indtast venligst et brugernavn og et kodeord'})
    }
>>>>>>> b8cc263c3f3c97740f1ecd7ce0d1297e7fd0e03a:controllers/userController.js
    const dato = new Date().toLocaleDateString()
    let brugere = læsJSON(EJER_FIL)
    if (brugere === undefined) {
        brugere = []
    }
    const id = brugere.length > 0 ? brugere[brugere.length - 1].id + 1 : 1
    if (brugere.find(b => b.navn === username) !== undefined) {
        return res.render('registerView', {errorMessage: 'Brugernavnet er allerede taget'})
    }
    
    let bruger = new User(id, username, password, dato, 1)
    brugere.push(bruger)
    await gemJSON(EJER_FIL, brugere)
    res.render('loginView')
}


export const getSingleUser = (req, res) => {
    let brugere = læsJSON(EJER_FIL)
    const userId = Number(req.params.id)
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
    const userId = Number(req.params.id)
    const bruger = brugere.find(b => b.id === userId)
    beskeder = beskeder.filter(b => b.ejer.id === userId)
    if (beskeder === undefined) {
        beskeder = []
    }
    res.render('chatMessageListView', {beskeder: beskeder, bruger: bruger, isKnownUser: req.session.isLoggedIn, viewMode: true})
}


