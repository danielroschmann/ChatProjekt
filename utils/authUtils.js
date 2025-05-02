import { læsJSON, EJER_FIL } from "./jsonUtils.js"
import bcrypt from 'bcrypt'

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
    } else if (req.url.includes('/users') && !(req.session.authLevel === 3)) {
        res.render('errorView', { isKnownUser: req.session.isLoggedIn, errorMessage: 'Du har ikke adgang til denne side' })
    } else {
        next()
    }
}

export function getAuthentificationLevel(username) {
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