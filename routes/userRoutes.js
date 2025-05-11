import express from 'express'

const router = express.Router()

import {getAllUsers, getSingleUser, createUser, signUp, getUserMessages, getUserProfile, updatePassword, changePassword} from '../controllers/userController.js'

router.route('/users').get(getAllUsers)
router.route('/opretBruger').get(signUp).post(createUser)
router.route('/users/:id/messages').get(getUserMessages)
router.route('/users/:id').get(getSingleUser)
router.route('/profile').get(getUserProfile)
router.route('/profile/password').get(changePassword).put(updatePassword)

export default router