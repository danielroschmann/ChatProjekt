import { gemJSON, læsJSON } from "./filData.js"
import path from 'path'

let brugere = []
const DATA_PATH = './data'
const EJER_FIL = path.join(DATA_PATH, 'users.json')

const createUser = async(req, res) => {
    brugere = læsJSON(EJER_FIL)
    const username = req.body.username
        const password = req.body.password
        const dato = new Date().toLocaleDateString()
        const id = brugere.length > 0 ? brugere[brugere.length - 1].id + 1 : 1
        if (brugere.find(b => b.navn === username) !== undefined) {
            return res.render('error')
        }
    
        let bruger = new Ejer(id, username, password, dato, 1)
        brugere.push(bruger)
        brugere = gemJSON(EJER_FIL, brugere)
        req.session.isLoggedIn = true
        req.session.username = username
        res.redirect('/chats')
}

export function checkCredentials(username, password) {
    let validate = false
    brugere.forEach(bruger => {
        if (username == bruger.navn && password == bruger.password) 
            {
            validate = true
            }
        }
    )
    return validate
}

export function checkAccess(req,res,next) {
    console.log("Forsøger at få adgang til siden " + req.url)
    if (req.url.includes('/chats') && !req.session.isLoggedIn || req.url.includes('/users') && !req.session.isLoggedIn)  {
        res.render('error')
    } else {
        next()
    }
}