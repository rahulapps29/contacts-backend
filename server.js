const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const contactRoutes = require("./routes/contactRoutes");

dotenv.config();
const app = express();

// Middleware

const cors = require("cors");
app.use(
  cors({
    origin: "*", // Allow all origins temporarily for testing
    methods: "GET,POST,PUT,DELETE",
    credentials: true, // If cookies or authentication are involved
  })
);

app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/contacts", contactRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
