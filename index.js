import fs from 'node:fs'

export function gemJSON(fil, arr) {
    let jsonFil = JSON.stringify(arr)
        fs.writeFile(fil, jsonFil, 'utf8', (err) => {
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
        return jsonObjekt
    } catch (err) {
        console.log('Kunne ikke læse fil: ' + fil + ' - ' + err)
    }
}





