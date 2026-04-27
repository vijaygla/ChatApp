import express from "express";
import { createGroup, getMessage, sendMessage } from "../controllers/messageController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/send/:id").post(isAuthenticated,sendMessage);
router.route("/:id").get(isAuthenticated, getMessage);
router.route("/group/create").post(isAuthenticated, createGroup);

export default router;

