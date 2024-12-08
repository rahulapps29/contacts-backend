const express = require("express");
const multer = require("multer");
const Contact = require("../models/Contact");
const router = express.Router();

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Create Contact
router.post("/", upload.single("photo"), async (req, res) => {
  try {
    const { name, phone, email, address, latitude, longitude } = req.body;
    const newContact = new Contact({
      name,
      phone,
      email,
      address,
      coordinates: { latitude, longitude },
      photo: req.file?.path,
    });
    await newContact.save();
    res
      .status(201)
      .json({ message: "Contact saved successfully!", contact: newContact });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch All Contacts
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Contact
router.delete("/:id", async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ error: "Contact not found" });
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete contact" });
  }
});

// Update Contact
router.put("/:id", async (req, res) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedContact)
      return res.status(404).json({ error: "Contact not found" });
    res
      .status(200)
      .json({
        message: "Contact updated successfully",
        contact: updatedContact,
      });
  } catch (error) {
    res.status(500).json({ error: "Failed to update contact" });
  }
});

module.exports = router;
