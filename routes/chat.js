import express from 'express'

const router = express.Router()

import {createChat, getChat, getSingleChat} from '../controllers/chats.js'

router.route('/chats').get(getChat).post(createChat)

router.route('/chats/:id').get(getSingleChat)

export default router

