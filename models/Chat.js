export default class Chat {
    constructor(id, navn, dato, ejer) {
        this.id = id
        this.beskeder = [];
        this.navn = navn;
        this.dato = dato;
        this.ejer = ejer
    }
}