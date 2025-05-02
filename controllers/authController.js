import { checkCredentials, getAuthentificationLevel } from "../utils/authUtils.js"

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

