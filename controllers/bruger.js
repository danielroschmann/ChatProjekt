import { gemJSON, læsJSON } from "./filData.js"
import { EJER_FIL, BESKED_FIL } from "./filData.js"
import Ejer from "../models/Ejer.js"

export const createUser = async (req, res) => {
    const username = req.body.username.trim()
    const password = req.body.password.trim()
    if (username.trim() === '' || password.trim() === '') {
        return res.render('opretBruger', {errorMessage: 'Indtast venligst et brugernavn og et kodeord'})
    }
    const dato = new Date().toLocaleDateString()
    let brugere = læsJSON(EJER_FIL)
    if (brugere === undefined) {
        brugere = []
    }
    const id = brugere.length > 0 ? brugere[brugere.length - 1].id + 1 : 1
    if (brugere.find(b => b.navn === username) !== undefined) {
        return res.render('opretBruger', {errorMessage: 'Brugernavnet er allerede taget'})
    }
    
    let bruger = new Ejer(id, username, password, dato, 1)
    brugere.push(bruger)
    await gemJSON(EJER_FIL, brugere)
    res.render('login')
}


export const getSingleUser = (req, res) => {
    let brugere = læsJSON(EJER_FIL)
    const userId = Number(req.params.id)
    const bruger = brugere.find(b => b.id === userId)
    res.render('user', {bruger: bruger, isKnownUser: req.session.isLoggedIn})
}

export const getAllUsers = (req, res) => {
    let brugere = læsJSON(EJER_FIL)
    res.render('users', {brugere: brugere, isKnownUser: req.session.isLoggedIn})
}

export const signUp = (req, res) => {
    res.render('opretBruger')
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
    res.render('messages', {beskeder: beskeder, bruger: bruger, isKnownUser: req.session.isLoggedIn, viewMode: true})
}


