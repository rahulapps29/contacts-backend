const express = require("express");
const multer = require("multer");
const Contact = require("../models/contact");
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
    const { name, phone, email, address, coordinates } = req.body;

    // Validate required fields
    if (!name || !phone || !email || !address || !coordinates) {
      console.log("Missing fields:", {
        name,
        phone,
        email,
        address,
        coordinates,
      });
      return res
        .status(400)
        .json({ error: "All fields, including coordinates, are required." });
    }

    // Log the uploaded file
    console.log("Uploaded file:", req.file);

    // Create a new contact
    const newContact = new Contact({
      name,
      phone,
      email,
      address,
      coordinates,
      photo: req.file?.path || null, // Use null if no file is uploaded
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
router.put("/:id", upload.single("photo"), async (req, res) => {
  try {
    const { name, phone, email, address, coordinates } = req.body;

    const updatedContact = {
      name,
      phone,
      email,
      address,
      coordinates, // Update the combined field
    };

    // Add photo only if a new file is uploaded
    if (req.file) {
      updatedContact.photo = req.file.path;
    }

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

module.exports = router;
