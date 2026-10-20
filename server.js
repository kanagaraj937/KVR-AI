const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Gemini API Route (Example)
app.post('/api/chat', async (req, res) => {
    try {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const { message } = req.body;
        const result = await model.generateContent(message);
        const response = await result.response;
        res.json({ reply: response.text() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "AI Error: " + error.message });
    }
});

// Test Route
app.get('/api/test', (req, res) => {
    res.json({ status: "KVR-AI is Running!" });
});

// --- FIXED FALLBACK ROUTE ---
// ithu than mukkiyam bro - app.get('*') ku badhila app.use
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- FIXED PORT BINDING ---
app.listen(PORT, '0.0.0.0', () => {
    console.log(`KVR-AI running on port ${PORT}`);
});