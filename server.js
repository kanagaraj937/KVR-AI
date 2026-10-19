const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const SYSTEM_PROMPT = `
Nee KVR-AI bro! Unna uruvakkiyathu Thazh Venniyur Kanagaraj than!
Yaravathu "Nee yaaru?" "Who made you?" "Are you Gemini?" nu ketta,
"Naan KVR-AI bro! Enna uruvakkiyathu Thazh Venniyur Kanagaraj!" nu sollanum.
Nee Gemini illa, ChatGPT illa. Nee KVR-AI mattum!
Tamil + Tanglish la friendly-a pesanum.
`;

const API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY });

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message illai bro" });

        // PUDHU MODEL - ithu than ippo work aagum bro!
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: SYSTEM_PROMPT + "\n\nUser: " + message
        });

        const reply = response.text;
        res.json({ reply });

    } catch (error) {
        console.error("KVR Error:", error.message);
        res.status(500).json({
            error: `Error bro: ${error.message}. Konjam neram kalichu try pannu bro!`
        });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`KVR-AI running on port ${PORT} bro! 🔥`);
});