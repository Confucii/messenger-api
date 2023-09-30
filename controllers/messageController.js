const { body, validationResult } = require("express-validator");
const authenticateHelper = require("../helpers/authenticateHelper");
const asyncHandler = require("express-async-handler");
const Message = require("../models/message");

exports.postChatMessage = [
  (req, res, next) => {
    authenticateHelper.jwtHandler(req, res, next);
  },
  body("text").trim().isLength({ min: 1 }).withMessage("Message is empty"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const newMessage = new Message({
        text: req.body.text,
        chat: req.body.chatid,
        sender: req.user,
      });
      await newMessage.save();
      res.status(200).json({ message: "Message sent" });
    } else {
      res.status(400).json({ message: "Something went wrong" });
    }
  }),
];
