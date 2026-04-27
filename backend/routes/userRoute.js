import express from "express";
import { getOtherUsers, getSidebarChats, login, logout, register } from "../controllers/userController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/").get(isAuthenticated,getSidebarChats);
router.route("/other").get(isAuthenticated, getOtherUsers);

export default router;

