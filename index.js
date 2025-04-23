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

export const brugere = {
    1: new Ejer(1, 'Ejer 1', '1234', '2022-01-01', 1),
    2: new Ejer(2, 'Ejer 2', '1234', '2022-01-01', 1),
    3: new Ejer(3, 'Ejer 3', '1234', '2022-01-01', 1),
}

export const chats = {
    1: new Chat(1, 'Chat 1', '2022-01-01', brugere[1]),
    2: new Chat(2, 'Chat 2', '2022-01-01', brugere[1]),
    3: new Chat(3, 'Chat 3', '2022-01-01', brugere[1]),
    4: new Chat(4, 'Chat 4', '2022-01-01', brugere[1]),
    5: new Chat(5, 'Chat 5', '2022-01-01', brugere[1]),
}

export const beskeder = {
    1: new Besked(1, 'Hej', '2022-01-01', brugere[1]),
    2: new Besked(1, 'Hygge', '2022-01-01', brugere[1]),
    3: new Besked(1, 'Drengerøv', '2022-01-01', brugere[1]),
    4: new Besked(1, 'lalalalalala', '2022-01-01', brugere[1]),
}




