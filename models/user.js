const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, trim: true },
});

const model = mongoose.model("UserSchema", UserSchema);

module.exports = model;
