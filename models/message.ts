import mongoose, { Types } from "mongoose";
import { DateTime } from "luxon";

interface Message {
  text: string;
  timestamp: Date;
  chat: Types.ObjectId;
  sender: Types.ObjectId;
  date: string;
}

const Schema = mongoose.Schema;

const MessageSchema = new Schema<Message>({
  text: {
    type: String,
    required: true,
    minlength: 1,
  },
  timestamp: { type: Date, default: Date.now },
  chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

MessageSchema.virtual("date").get(function () {
  return this.timestamp
    ? DateTime.fromJSDate(this.timestamp).toFormat("HH:mm LLL dd")
    : "";
});

MessageSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const Message = mongoose.model("Message", MessageSchema);
