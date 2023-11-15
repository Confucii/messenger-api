import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  updatedAt: { type: Date, default: Date.now },
});

ChatSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const Chat = mongoose.model("Chat", ChatSchema);
