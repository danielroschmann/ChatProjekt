import express from 'express'

const router = express.Router()

import {getAllUsers, getSingleUser, createUser, signUp, getUserMessages, getUserProfile} from '../controllers/userController.js'

router.route('/users').get(getAllUsers)
router.route('/opretBruger').get(signUp).post(createUser)
router.route('/users/:id/messages').get(getUserMessages)
router.route('/users/:id').get(getSingleUser)
router.route('/profile').get(getUserProfile)

export default router