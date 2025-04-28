export const createChat = (req, res) => {
    // TODO
}

export const getChat = (req, res) => {
    res.render('chats', {chats: chats, isKnownUser: req.session.isLoggedIn})
}

export const getSingleChat = (req, res) => {
    // TODO
}



