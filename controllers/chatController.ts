import { Request, Response } from "express";
import checkAuth from "../middlewares/userHandler";
import { Chat } from "../models/chat";
import { Message } from "../models/message";
import { User } from "../models/user";
import { PopulatedChat } from "../types";

export const getChats = [
  checkAuth,
  async (req: Request, res: Response) => {
    const chats = (await Chat.find({
      $or: [{ userOne: req.user }, { userTwo: req.user }],
    })
      .populate("userOne", "displayName")
      .populate("userTwo", "displayName")) as unknown as PopulatedChat[];

    const chatMessages = await Promise.all(
      chats.map(async (chat) => {
        const message = await Message.findOne({ chat: chat.id })
          .sort({ timestamp: -1 })
          .limit(1)
          .populate("sender", "displayName");
        return {
          id: chat.id,
          interlocutor: {
            name:
              req.user === chat.userOne.id
                ? chat.userTwo.displayName
                : chat.userOne.displayName,
            id:
              req.user === chat.userOne.id ? chat.userTwo.id : chat.userOne.id,
          },
          messages: [
            {
              sender: message?.sender,
              text: message?.text,
              timestamp: message?.date,
            },
          ],
        };
      })
    );
    res.status(200).json(chatMessages);
  },
];

export const createChat = [
  checkAuth,
  async (req: Request, res: Response) => {
    const sender = await User.findById(req.user);
    const recipient = await User.findById(req.body.recipient);
    if (!recipient)
      return res.status(400).json({ message: "User does not exist" });
    const chatExists = await Chat.find({
      $or: [
        { userOne: req.user, userTwo: req.body.recipient },
        { userOne: req.body.recipient, userTwo: req.user },
      ],
    });
    if (chatExists.length > 0) return res.status(200).json(chatExists);
    const newChat = new Chat({
      userOne: req.user,
      userTwo: req.body.recipient,
    });
    const io = await req.app.get("socket");

    io.to(String(req.user)).emit("newChat", {
      id: newChat.id,
      interlocutor: { name: recipient.displayName, id: recipient.id },
      messages: [],
    });
    io.to(String(req.body.recipient)).emit("newChat", {
      id: newChat.id,
      interlocutor: { name: sender?.displayName, id: sender?.id },
      messages: [],
    });
    await newChat.save();
    res.status(200).json(newChat);
  },
];

export const getChat = [
  checkAuth,
  async (req: Request, res: Response) => {
    const chat = (await Chat.findById(req.params.chatid)
      .populate("userOne", "displayName")
      .populate("userTwo", "displayName")) as unknown as PopulatedChat;
    if (!chat) return res.status(400).json({ message: "Chat does not exist" });
    if (
      String(chat.userOne.id) !== req.user &&
      String(chat.userTwo.id) !== req.user
    )
      return res.status(401).json({ message: "Insufficient access" });
    const messages = await Message.find({ chat: req.params.chatid })
      .sort({
        timestamp: 1,
      })
      .populate("sender", "displayName");
    const responseChat = {
      id: chat.id,
      interlocutor: {
        name:
          req.user === chat.userOne.id
            ? chat.userTwo.displayName
            : chat.userOne.displayName,
        id: req.user === chat.userOne.id ? chat.userTwo.id : chat.userOne.id,
      },
      messages: messages.map((message) => {
        return {
          id: message?.id,
          sender: message?.sender,
          text: message?.text,
          timestamp: message?.date,
        };
      }),
    };
    res.status(200).json(responseChat);
  },
];
