import express from 'express'

import session from 'express-session'

const app = express()

const port = 8000


app.set('view engine', 'pug')



app.listen(port, () => {
    console.log("Listening on port 8000");
})