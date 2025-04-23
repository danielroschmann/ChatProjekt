import express from 'express'

const router = express.Router()
const {
    opretBesked,
    hentBesked,
    sletBesked,
    redigerBesked
} = require('../controllers/besked')