import express from "express";
import * as messageController from "../controllers/messageController";

const messageRouter = express.Router();

messageRouter.post("/", messageController.postChatMessage);

export default messageRouter;
