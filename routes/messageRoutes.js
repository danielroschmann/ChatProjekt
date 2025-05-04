import express from 'express';
const router = express.Router();

import { deleteMessage, getAllMessagesInChat, getSingleMessage, createMessage, updateMessage, editMessage } from '../controllers/messageController.js';

router.route('/chats/:id/messages').get(getAllMessagesInChat).post(createMessage);
router.route('/chats/messages/:id').get(getSingleMessage)
router.route('/chats/messages/:id/edit').get(editMessage).post(updateMessage);
router.route('/chats/messages/:id/delete').get(deleteMessage);

export default router;
