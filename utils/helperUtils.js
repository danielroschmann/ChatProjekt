
export const generateUniqueId = () => {
    return crypto.randomUUID()
    // const length = 21
    // const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    // const result = new Array(length)
    // for (let i = 0; i < length; i++) {
    //     result[i] = characters.charAt(Math.floor(Math.random() * characters.length))
    // }
    // return result.join('')
}
