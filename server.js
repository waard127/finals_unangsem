// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Ensure you have a .env file, or hardcode the URI below

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- MONGODB CONNECTION ---
// TODO: Replace with your actual MongoDB connection string if not using .env
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/student_tracker_db";

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// --- USER SCHEMA ---
// This defines what we save about the professor
const userSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    displayName: String,
    photoURL: String, // Stores the link to the profile picture
    role: { type: String, default: 'Professor' },
    
    // Stats for the Dashboard/Profile
    stats: {
        reportsGenerated: { type: Number, default: 0 },
        totalSystemUsers: { type: Number, default: 0 },
        activeSectionsManaged: { type: Number, default: 0 }
    },
    
    lastLogin: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// --- API ROUTES ---

// 1. SYNC USER (Called after Firebase Login)
app.post('/api/user-sync', async (req, res) => {
    const { uid, email, displayName, photoURL } = req.body;

    console.log(`🔄 Syncing user: ${email}`);

    try {
        // Find the user by UID. If found, update details. If not, create new (upsert).
        const user = await User.findOneAndUpdate(
            { uid: uid },
            { 
                $set: { 
                    email: email, 
                    displayName: displayName,
                    photoURL: photoURL, // Always update photo in case it changed on Google
                    lastLogin: new Date()
                },
                $setOnInsert: { 
                    // Default values only for NEW users
                    role: 'Professor',
                    stats: { 
                        reportsGenerated: 0, 
                        totalSystemUsers: 0, 
                        activeSectionsManaged: 0 
                    }
                }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        console.log("✅ User Synced:", user.displayName);
        res.json(user); // Send the updated profile back to React
    } catch (error) {
        console.error("❌ Sync Error:", error);
        res.status(500).json({ message: "Server Error syncing user" });
    }
});

// 2. UPDATE PROFILE (Called from Profile Page Settings)
app.put('/api/user-update/:uid', async (req, res) => {
    const { uid } = req.params;
    const { displayName, email } = req.body;

    try {
        const updatedUser = await User.findOneAndUpdate(
            { uid: uid },
            { $set: { displayName, email } },
            { new: true }
        );
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Failed to update profile" });
    }
});

// --- START SERVER ---
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));