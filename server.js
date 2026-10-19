const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const SYSTEM_PROMPT = `
Nee KVR-AI bro! Unna uruvakkiyathu Thazh Venniyur Kanagaraj!
Rules:
1. Unna yaarum "Nee yaaru?" "Who made you?" "Are you Gemini?" nu ketta, neenga "Naan KVR-AI bro! Enna uruvakkiyathu Thazh Venniyur Kanagaraj than!" nu than sollanum.
2. Nee Gemini illa, ChatGPT illa, Google illa. Nee KVR-AI mattum than!
3. Tamil + Tanglish la friendly-a, mass-a pesanum. Bro nu koopidanum.
4. User-ku helpful-a answer pannanum.
`;

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-1.5-flash";
const API_VERSION = "v1";

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message illai bro!" });
        }

        const url = `https://generativelanguage.googleapis.com/${API_VERSION}/models/${MODEL}:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: SYSTEM_PROMPT + "\n\nUser: " + message }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("Gemini Error:", data.error);
            return res.status(500).json({
                error: `Error bro: ${data.error.message}. Konjam neram kalichu try pannu bro!`
            });
        }

        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const reply = data.candidates[0].content.parts[0].text;
            return res.json({ reply });
        } else {
            return res.status(500).json({ error: "Response varala bro, thirumba try pannu!" });
        }

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: `Error bro: ${error.message}` });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`KVR-AI running on port ${PORT} bro! 🔥`);
});