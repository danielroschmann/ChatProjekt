import { læsJSON, EJER_FIL } from "./fileStorageController.js"

export const logIn = (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const authLevel = getAuthentificationLevel(username)
    if(checkCredentials(username, password)) {
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

export function checkCredentials(username, password) {
    let validate = false
    let brugere = læsJSON(EJER_FIL)
    brugere.forEach(bruger => {
        if (username == bruger.navn && password == bruger.password) 
            {
            validate = true
            }
        }
    )
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