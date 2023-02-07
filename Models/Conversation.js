const { Schema, model } = require("mongoose");

const conversationSchema = new Schema({
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

module.exports = model("Conversations", conversationSchema);
