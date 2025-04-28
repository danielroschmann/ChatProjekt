export const createChat = (req, res) => {
    // TODO
}

export const getChat = (req, res) => {
    res.render('chats', {chats: chats, isKnownUser: req.session.isLoggedIn})
}

export const getSingleChat = (req, res) => {
    const chatId = Number(req.params.id)
    const chat = chats.find(c => c.id === chatId)
    
    res.render('chatServer', {chat: chat, isKnownUser: req.session.isLoggedIn})
}



