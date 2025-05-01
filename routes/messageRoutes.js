import express from 'express';
const router = express.Router();

import { getAllMessagesInChat, getSingleMessage, createMessage, updateMessage, editMessage } from '../controllers/messageController.js';

router.route('/chats/:id/messages').get(getAllMessagesInChat).post(createMessage);
router.route('/chats/messages/:id').get(getSingleMessage)
router.route('/chats/messages/:id/edit').get(editMessage).post(updateMessage);

export default router;
