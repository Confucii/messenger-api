import express from "express";
import * as chatController from "../controllers/chatController";

const router = express.Router();

router.get("/", chatController.getChats);

router.post("/", chatController.createChat);

router.get("/:chatid", chatController.getChat);

export default router;
