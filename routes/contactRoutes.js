const express = require("express");
const Contact = require("../models/contact");
const router = express.Router();

// Create Contact
router.post("/", async (req, res) => {
  try {
    const { name, phone, email, address, coordinates } = req.body;

    if (!name || !phone || !email || !address || !coordinates) {
      return res
        .status(400)
        .json({ error: "All fields, including coordinates, are required." });
    }

    const newContact = new Contact({
      name,
      phone,
      email,
      address,
      coordinates,
    });

    await newContact.save();
    res
      .status(201)
      .json({ message: "Contact created successfully!", contact: newContact });
  } catch (error) {
    console.error("Error creating contact:", error.message);
    res.status(500).json({ error: "Failed to create contact." });
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

// Update Contact
router.put("/:id", async (req, res) => {
  try {
    const { name, phone, email, address, coordinates } = req.body;

    const updatedContact = {
      name,
      phone,
      email,
      address,
      coordinates,
    };

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      updatedContact,
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    res.status(200).json({ message: "Contact updated successfully!", contact });
  } catch (error) {
    console.error("Error updating contact:", error.message);
    res.status(500).json({ error: "Failed to update contact." });
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

module.exports = router;
