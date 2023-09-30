const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.get("/", chatController.getChats);

router.post("/", chatController.createChat);

router.get("/:chatid", chatController.getChat);

router.put("/:chatid", chatController.updateChat);

router.delete("/:chatid", chatController.deleteChat);

module.exports = router;
