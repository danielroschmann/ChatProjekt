import express from 'express'

const router = express.Router()


import {getChats, createChat, updateChat, deleteChat} from '../controllers/chats'  

router.route('/login').get(getChats).post