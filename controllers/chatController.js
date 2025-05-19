import { CHAT_FIL } from "../utils/jsonUtils.js";
import { læsJSON } from "../utils/jsonUtils.js";
import Chat from "../models/chatModel.js";
import {
  getChatFromChatId,
  handeChatCreation,
  handleChatDeletion,
  handleChatUpdate,
} from "../utils/chatUtils.js";
import { getMessageFromMessageId } from "../utils/messageUtils.js";

const MAX_CHARACTERS = 20;
const MIN_CHARACTERS = 3;

export const createChat = async (req, res) => {
  let chatName = req.body.chatNavn.trim();
  let username = req.session.username;
  let chatArr = læsJSON(CHAT_FIL);
  let chatNameAvailable =
    chatArr.find(
      (chat) => chat.navn.toLowerCase() === chatName.toLowerCase()
    ) === undefined;
  if (!chatNameAvailable) {
    return res.render("chatsView", {
      username,
      authLevel: req.session.authLevel,
      chats: chatArr,
      errorMessage: "Navnet er allerede taget",
    });
  }
  if (chatName === undefined || chatName === "") {
    return res.render("chatsView", {
      username,
      authLevel: req.session.authLevel,
      chats: chatArr,
      errorMessage: "Indtast venligst et navn",
    });
  }
  if (chatName.length > MAX_CHARACTERS) {
    return res.render("chatsView", {
      username,
      authLevel: req.session.authLevel,
      chats: chatArr,
      errorMessage: "Navnet er for langt",
    });
  }
  if (chatName.length < MIN_CHARACTERS) {
    return res.render("chatsView", {
      username,
      authLevel: req.session.authLevel,
      chats: chatArr,
      errorMessage: "Navnet er for kort",
    });
  }
  handeChatCreation(chatName, username);
  res.redirect("/chats");
};

export const getChat = (req, res) => {
  let chats = læsJSON(CHAT_FIL);
  res.render("chatsView", {
    username: req.session.username,
    chats: chats,
    isKnownUser: req.session.isLoggedIn,
    authLevel: req.session.authLevel,
  });
};

export const getSingleChat = (req, res) => {
  const chatId = String(req.params.id);
  console.log(`Fetching chat with ID: ${chatId}`);

  const chat = getChatFromChatId(chatId);
  if (!chat) {
    console.error(`Chat with ID ${chatId} not found`);
    return res.status(404).send("Chat ikke fundet");
  }

  const user = chat.ejer || { navn: "Ukendt" };
  console.log(`Chat found:`, chat);

  res.render("chatDetailView", {
    user,
    chat: chat,
    isKnownUser: req.session.isLoggedIn,
  });
};

export const getChatMessages = (req, res) => {
  const chatId = String(req.params.id);
  const chat = getChatFromChatId(chatId);

  res.render("chatMessageListView", {
    chat: chat,
    isKnownUser: req.session.isLoggedIn,
    username: req.session.username,
  });
};

export const getDetailedChatMessage = (req, res) => {
  const messageId = Number(req.params.id);
  const message = getMessageFromMessageId(messageId);

  res.render("messageDetailView", { besked: message });
};

export const deleteChat = async (req, res) => {
  try {
    const chatId = String(req.params.id);
    handleChatDeletion(chatId);
    res.status(200).json({ message: "Chat slettet" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const editChat = async (req, res) => {
  const chatId = String(req.params.id);
  const chat = await getChatFromChatId(chatId);
  res.render("chatEditView", {
    chat: chat,
    isKnownUser: req.session.isLoggedIn,
  });
};

export const updateChat = (req, res) => {
  try {
    const newName = req.body.name;
    const chatId = String(req.params.id);
    const chat = getChatFromChatId(chatId);
    const chatIndex = læsJSON(CHAT_FIL).findIndex((c) => c.id === chatId);
    const chatMessages = chat.beskeder;
    let updatedChat = new Chat(chatId, newName, chat.dato, chat.ejer);
    updatedChat.beskeder = chatMessages;
    handleChatUpdate(updatedChat, chatIndex);
    res.status(200).json({ message: "Chat opdateret" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
