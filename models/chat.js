const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Chat", ChatSchema);
