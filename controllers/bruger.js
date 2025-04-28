
let brugere = []

export const createUser = (req, res) => {
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

export const getSingleUser = (req, res) => {
    // TODO
}

export const getAllUsers = (req, res) => {
    res.render('users', {brugere: brugere, isKnownUser: req.session.isLoggedIn})
}

export const login = (req, res) => {
    const username = req.body.username
        const password = req.body.password
        console.log(username + " " + password)
        if(checkCredentials(username, password)) {
                req.session.isLoggedIn = true
                req.session.username = username
                res.redirect('chats')
        } else {
            res.render('error')
        }
}

export const loguout = (req, res) => {
    req.session.destroy()
    res.redirect('/')
}

