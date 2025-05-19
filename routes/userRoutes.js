import express from "express";

const router = express.Router();

import {
  getAllUsers,
  getSingleUser,
  createUser,
  signUp,
  getUserMessages,
  getUserProfile,
  updatePassword,
  changePassword,
  updateAuthLevel,
  deleteUser,
} from "../controllers/userController.js";

router.route("/users").get(getAllUsers);
router.route("/opretBruger").get(signUp).post(createUser);
router.route("/users/:id/messages").get(getUserMessages);
router.route("/users/:id").get(getSingleUser).delete(deleteUser);
router.route("/profile").get(getUserProfile);
router.route("/profile/password").get(changePassword).put(updatePassword);
router.route("/users/:id/auth").put(updateAuthLevel);

export default router;
