import { Request, Response } from "express";
import { Message } from "../models/message";
import { Chat } from "../models/chat";
import checkAuth from "../middlewares/userHandler";

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
    chat.updatedAt = new Date(newMessage.date);
    await chat.save();
    await newMessage.save();
    await newMessage.populate("sender", "displayName");
    const io = await req.app.get("socket");
    io.to(String(chat.userOne)).to(String(chat.userTwo)).emit("newMessage", {
      chat: chat.id,
      id: newMessage.id,
      sender: newMessage.sender,
      text: newMessage.text,
      timestamp: newMessage.date,
    });
    return res.status(200).json(newMessage);
  },
];
