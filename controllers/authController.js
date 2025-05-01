import { læsJSON, EJER_FIL } from "./fileStorageController.js"
import bcrypt from 'bcrypt'

export const logIn = async (req, res) => {
    const {username, password } = req.body
    const authLevel = getAuthentificationLevel(username)
    if(await checkCredentials(username, password)) {
            req.session.isLoggedIn = true
            req.session.username = username
            req.session.authLevel = authLevel
            res.redirect('chats')
    } else {
        res.render('loginView', {  errorMessage: 'Forkert brugernavn eller kodeord' })
    }
}

export const logOut = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/')
        }
    })
    res.clearCookie('connect.sid')
    res.render('homepageView')
}

export const showLogInPage = (req, res) => {
    res.render('loginView')
}

export async function checkCredentials(username, password) {
    let validate = false
    let brugere = læsJSON(EJER_FIL)
    for (const bruger of brugere) {
        if (username === bruger.navn) 
            {
            const passwordMatch = await bcrypt.compare(password,bruger.password)
            if (passwordMatch) validate = true
            }
        }
    return validate
}

export function checkAccess(req, res, next) {
    console.log("Forsøger at få adgang til siden " + req.url)
    if ((req.url.includes('/chats') || req.url.includes('/users')) && !req.session.isLoggedIn)  {
        res.render('errorView', { errorMessage: 'Du skal være logget ind for at se denne side' })
    } else {
        next()
    }
}

function getAuthentificationLevel(username) {
    let authentificationLevel = 1
    let brugere = læsJSON(EJER_FIL)
    brugere.forEach(bruger => {
        if (username == bruger.navn) 
            {
            authentificationLevel = bruger.niveau
            }
        }
    )
    return authentificationLevel
}