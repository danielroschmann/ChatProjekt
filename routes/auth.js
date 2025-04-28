import express from 'express'
import { logIn, logOut, showLogInPage } from '../controllers/auth.js'
const router = express.Router()

router.route('/login').get(showLogInPage).post(logIn)
router.route('/logout').get(logOut)

export default router