const { Contact } = require("./models");

const addContact = async (req, res) => {
  const contact = await Contact.create({
    ...req.body,
    userId: req.user.id
  });
  res.json(contact);
};

const getContacts = async (req, res) => {
  const contacts = await Contact.find({ userId: req.user.id });
  res.json(contacts);
};

const updateContact = async (req, res) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  );
  res.json(contact);
};

const deleteContact = async (req, res) => {
  await Contact.deleteOne({ _id: req.params.id, userId: req.user.id });
  res.json({ msg: "Deleted" });
};

module.exports = { addContact, getContacts, updateContact, deleteContact };
