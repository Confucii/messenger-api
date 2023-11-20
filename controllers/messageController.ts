import { Request, Response } from "express";
import { Message } from "../models/message";
import { Chat } from "../models/chat";
import checkAuth from "../middlewares/userHandler";
import { log } from "console";

export const postChatMessage = [
  checkAuth,
  async (req: Request, res: Response) => {
    const chat = await Chat.findById(req.params.chatid);
    if (!chat) return res.status(400).json({ message: "Chat does not exist" });
    const newMessage = new Message({
      text: req.body.text,
      chat: req.params.chatid,
      sender: req.user,
    });
    chat.updatedAt = new Date(Date.now());
    await chat.save();
    await newMessage.save();
    const io = await req.app.get("socket");
    io.emit("confirm");
    return res.status(200).json(newMessage);
  },
];
