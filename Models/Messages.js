const { Schema, model } = require("mongoose");

const messageSchema = new Schema({
  conversationId: { type: Schema.Types.ObjectId, ref: "Conversation" },
  sender: { type: Schema.Types.ObjectId, ref: "User" },
  text: { type: String },
  seen: { type: Boolean, default: false },
}, {timestamps: true});

module.exports = model("Messages", messageSchema);
