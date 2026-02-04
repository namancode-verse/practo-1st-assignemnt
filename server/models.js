const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});

const ContactSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  name: String,
  phone: String,
  email: String,
  notes: String,
  tags: [String],
  isFavorite: { type: Boolean, default: false }
});

module.exports = {
  User: mongoose.model("User", UserSchema),
  Contact: mongoose.model("Contact", ContactSchema)
};
