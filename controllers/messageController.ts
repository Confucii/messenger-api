import { Request, Response } from "express";
import { Message } from "../models/message";

export const postChatMessage = [
  async (req: Request, res: Response) => {
    const newMessage = new Message({
      text: req.body.text,
      chat: req.body.chatid,
      sender: req.user,
    });
    await newMessage.save();
    res.status(200).json({ message: "Message sent" });
  },
];
