import { gemJSON, læsJSON } from "./filData.js"
import { EJER_FIL } from "./filData.js"
import path from 'path'

export const createUser = async (req, res) => {
    const username = req.body.username
    const password = req.body.password
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
    req.session.isLoggedIn = true   
    req.session.username = username
    res.render('chats')
}


export const getSingleUser = (req, res) => {
    // TODO
}

export const getAllUsers = (req, res) => {
    let brugere = læsJSON(EJER_FIL)
    res.render('users', {brugere: brugere, isKnownUser: req.session.isLoggedIn})
}



