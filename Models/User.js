const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, unique: true },
  username: { type: String, required: true, lowercase: true, unique: true },
  password: {type: String, required: true, minLength: 8},
  imagelink: { type: String, default: null },
});

module.exports = model("User", userSchema);
