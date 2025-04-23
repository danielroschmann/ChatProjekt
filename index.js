class Chat {
    constructor(id, navn, dato, ejer) {
        this.id = id
        this.beskeder = [];
        this.navn = navn;
        this.dato = dato;
        this.ejer = ejer
    }
}
class Besked {
    constructor(id, besked, dato, ejer, chatId) {
        this.id = id;
        this.besked = besked;
        this.dato = dato;
        this.ejer = ejer;
        this.chatId = chatId;
    }
}
class Ejer {
    constructor(id, navn, password, dato, niveau) {
        this.id = id;
        this.navn = navn;
        this.password = password;
        this.dato = dato;
        this.niveau = niveau;
    }
}

module.exports = { Chat, Besked, Ejer }