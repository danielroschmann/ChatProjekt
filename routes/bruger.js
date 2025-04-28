import express from 'express'

const router = express.Router()

import {getAllUsers, getSingleUser, createUser, signUp, getUserMessages} from '../controllers/bruger.js'

router.route('/users').get(getAllUsers)
router.route('/opretBruger').get(signUp).post(createUser)
router.route('/users/:id/messages').get(getUserMessages)
router.route('/users/:id').get(getSingleUser)

export default router