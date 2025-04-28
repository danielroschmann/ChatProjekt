import express from 'express'

const router = express.Router()

import {getAllUsers, getSingleUser, createUser, getMessagesFromUser} from '../controllers/bruger'

router.route('/users').get(getAllUsers)

router.route('/users/:id').get(getSingleUser).post(createUser)

router.route('/users/:id/messages').get(getMessagesFromUser)

export default router