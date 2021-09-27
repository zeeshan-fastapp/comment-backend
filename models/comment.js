const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema({
  text: { type: String, required: true },
  parent: {
    type: mongoose.Schema.Types.Object,
    ref: "UserSchema",
    default: null,
  },
  authorId: { type: String, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, default: null },
});

const model = mongoose.model("CommentSchema", CommentSchema);

module.exports = model;
