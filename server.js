const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect("mongodb+srv://cpsrajan2002:Vhp6qr83AvRDgcC8@cluster0.fekke.mongodb.net/NodeJs_mastery_course", {
    dbName: "NodeJs_mastery_course"
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.log("❌ MongoDB Connection Error:", err));

// Define Schema & Model
const contactSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    message: String,
});

const Contact = mongoose.model("Contact", contactSchema);

// ✅ Test Route to Check if Server is Running
app.get("/", (req, res) => {
    res.send("🚀 Server is running!");
});

// ✅ Debugging Route to Check MongoDB
app.get("/check-db", async (req, res) => {
    try {
        const contacts = await Contact.find(); // Fetch all records
        res.json({ success: true, contacts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ✅ POST Route to Save Data
app.post("/contact", async (req, res) => {
    try {
        console.log("📥 Received Data:", req.body); // Debugging

        const { firstName, lastName, email, phone, message } = req.body;

        if (!firstName || !lastName || !email || !phone || !message) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        const newContact = new Contact({ firstName, lastName, email, phone, message });

        await newContact.save();
        res.status(201).json({ success: true, message: "Message sent successfully!" });
    } catch (error) {
        console.error("❌ Error saving to MongoDB:", error);
        res.status(500).json({ success: false, message: "Error saving data", error: error.message });
    }
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
