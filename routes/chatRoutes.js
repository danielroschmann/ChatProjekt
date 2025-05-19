import express from "express";

const router = express.Router();

import {
  updateChat,
  createChat,
  getChat,
  getSingleChat,
  getChatMessages,
  deleteChat,
} from "../controllers/chatController.js";

router.route("/chats").get(getChat).post(createChat);

router.route("/chats/:id").get(getSingleChat);

router.route("/chats/:id/messages").get(getChatMessages);

router.route("/chats/:id/delete").delete(deleteChat);
router.route("/chats/:id/update").put(updateChat);

export default router;
