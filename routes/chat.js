import express from 'express'

const router = express.Router()

import {createChat, getChat, getSingleChat, getChatMessages, deleteChat} from '../controllers/chats.js'

router.route('/chats').get(getChat).post(createChat)

router.route('/chats/:id').get(getSingleChat)

router.route('/chats/:id/messages').get(getChatMessages)

router.route('/chats/:id/delete').post(deleteChat)

export default router

