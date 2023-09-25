const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

router.get("/", messageController.getChatMessages);

router.post("/", messageController.postChatMessage);

module.exports = router;
