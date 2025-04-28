import express from 'express'

const router = express.Router()

import {createChat, getChat, getSingleChat, getChatMessages} from '../controllers/chats.js'

router.route('/chats').get(getChat).post(createChat)

router.route('/chats/:id').get(getSingleChat)

router.route('/chats/:id/messages').get(getChatMessages)

export default router

