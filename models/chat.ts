import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  updatedAt: { type: Date, default: Date.now },
});

export const Chat = mongoose.model("Chat", ChatSchema);
