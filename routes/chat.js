import express from 'express'

const router = express.Router()

import {createChat, getChat, getSingleChat} from '../controllers/chats'

router.route('/chats').get(getChat)

router.route('/chats/:id').get(getSingleChat).post(createChat)

export default router

