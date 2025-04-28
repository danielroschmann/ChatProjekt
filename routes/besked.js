import express from 'express';
const router = express.Router();

import { getAllMessagesInChat, getSingleMessage, createMessage, updateMessage } from '../controllers/besked.js';
import { BESKED_FIL, læsJSON, CHAT_FIL, gemJSON, EJER_FIL } from '../controllers/filData.js';

// her dine routes
router.route('/chats/:id/messages').get(getAllMessagesInChat).post(createMessage);
router.route('/chats/messages/:id').get(getSingleMessage).put(updateMessage);

export default router;
