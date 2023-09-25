const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.get("/", chatController.getChats);

router.post("/", chatController.createChat);

router.get("/:chatId", chatController.getChat);

router.put("/:chatId", chatController.updateChat);

module.exports = router;
