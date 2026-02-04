require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { register, login, authMiddleware } = require("./auth");
const { addContact, getContacts, updateContact, deleteContact } = require("./contacts");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"));

app.post("/register", register);
app.post("/login", login);

app.post("/contacts", authMiddleware, addContact);
app.get("/contacts", authMiddleware, getContacts);
app.put("/contacts/:id", authMiddleware, updateContact);
app.delete("/contacts/:id", authMiddleware, deleteContact);

app.listen(process.env.PORT, () =>
  console.log(`Server running on ${process.env.PORT}`)
);
