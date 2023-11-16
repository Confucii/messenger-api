import express from "express";
import * as chatController from "../controllers/chatController";

const router = express.Router();

router.get("/", chatController.getChats);

router.post("/", chatController.createChat);

router.get("/:chatid", chatController.getChat);

router.put("/:chatid", chatController.updateChat);

router.delete("/:chatid", chatController.deleteChat);

export default router;
