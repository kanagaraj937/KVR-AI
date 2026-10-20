const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// API Routes
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
        res.status(500).json({ error: error.message });
    }
});

// --- MAIN FIX ---
app.use((req, res) => {
    // Check where index.html is
    const possiblePaths = [
        path.join(__dirname, 'public', 'index.html'),
        path.join(__dirname, 'index.html'),
        path.join(__dirname, 'client', 'index.html'),
        path.join(__dirname, 'build', 'index.html')
    ];

    for (let p of possiblePaths) {
        if (fs.existsSync(p)) {
            return res.sendFile(p);
        }
    }

    // If no html file, just send live message
    res.send('<h1>KVR-AI LIVE 🚀</h1><p>Server is working! Frontend path set pannunga.</p><p>API: /api/test working?</p>');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`KVR-AI running on port ${PORT}`);
});