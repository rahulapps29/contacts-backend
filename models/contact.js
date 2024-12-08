const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  coordinates: { type: String }, // Store as a string: "latitude,longitude"
  photo: { type: String }, // Path to the uploaded photo
});

module.exports = mongoose.model("Contact", contactSchema);
