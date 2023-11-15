import mongoose from "mongoose";
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
  chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

MessageSchema.virtual("date").get(function () {
  return this.timestamp
    ? DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATE_MED)
    : "";
});

export const Message = mongoose.model("Message", MessageSchema);
