import fs, { promises as fsPromises } from 'fs'
import path from 'path'

export const EJER_FIL = path.join('./data', 'users.json')
export const CHAT_FIL = path.join('./data', 'chats.json')
export const BESKED_FIL = path.join('./data', 'messages.json')

export async function gemJSON(fil, arr) {
    let jsonFil = JSON.stringify(arr)
    await fsPromises.writeFile(fil, jsonFil, 'utf8', (err) => {
        if (err) {
            console.error(err) 
        } else {
            console.log('Filen er skrevet')
        }
    })
}
export function læsJSON(fil) {
    try {
        let jsonData = fs.readFileSync(fil, 'utf8')
        let jsonObjekt = JSON.parse(jsonData)
        console.log('Indlæst data fra fil: ' + fil)
        jsonObjekt.forEach(element => {
            console.log(element)
        });
        return jsonObjekt
    } catch (err) {
        console.log('Kunne ikke læse fil: ' + fil + ' - ' + err)
        return []
    }
}
