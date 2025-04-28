import express from 'express'

const router = express.Router()

import {getAllUsers, getSingleUser, createUser} from '../controllers/bruger.js'

router.route('/users').get(getAllUsers).post(createUser)

router.route('/users/:id').get(getSingleUser)

export default router