import { gemJSON } from "./index.js"

let brugere = []
const EJER_FIL = path.join(DATA_PATH, 'users.json')

const createUser = async(req, res) => {
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