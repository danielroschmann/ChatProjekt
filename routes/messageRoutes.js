import express from "express";
const router = express.Router();

import {
  getAllMessagesInChat,
  getSingleMessage,
  createMessage,
  updateMessage,
  editMessage,
  deleteMessage,
} from "../controllers/messageController.js";

router
  .route("/chats/:id/messages")
  .get(getAllMessagesInChat)
  .post(createMessage);
router
  .route("/chats/messages/:id")
  .get(getSingleMessage)
  .put(updateMessage)
  .delete(deleteMessage);
router.route("/chats/messages/:id/edit").get(editMessage);

export default router;
