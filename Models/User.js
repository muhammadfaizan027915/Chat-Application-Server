const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, unique: true },
  username: { type: String, required: true, lowercase: true, unique: true },
  imagelink: { type: String, default: null },
});

module.exports = model("User", userSchema);
