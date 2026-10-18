require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.json({ reply: "API Key Illa bro! Render Environment-la Key Add pannala!" });
        }

        console.log("Message vanthuchu:", message);

        // KVR AI - NO DA, ONLY BRO
        const systemPrompt = `You are KVR AI, created by Kanagaraj from Thazh Venniyur. You are NOT Gemini, NOT Google, NOT Meta. You are KVR AI.
        Your creator is Kanagaraj from Thazh Venniyur. Call user 'bro' in a friendly way. Speak Tamil Tanglish mix mostly. Never use the word 'da' or 'thambi'. Only use 'bro'.
        If asked name: Say "Naan KVR AI bro, Kanagaraj uruvakkiyathu!"
        If asked who made you: Say "Enna Kanagaraj bro than uruvakkinaru Thazh Venniyur-la irunthu!"
        If asked where from: Say "Thazh Venniyur bro!"
        Strictly avoid using 'da', 'dey', 'machan', 'thambi'. Only use 'bro'. Be respectful.
        Never ever say you are Gemini or Google. Always say KVR AI from Thazh Venniyur.
        User message: `;

        const fullMessage = systemPrompt + message;

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: fullMessage }] }]
            })
        });

        const data = await response.json();
        console.log("Gemini Full Response:", JSON.stringify(data));

        if (data.error) {
            return res.json({ reply: `API Error bro: ${data.error.message}` });
        }

        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const reply = data.candidates[0].content.parts[0].text;
            return res.json({ reply: reply });
        } else {
            return res.json({ reply: `Data sariya varala bro: ${JSON.stringify(data).substring(0, 200)}` });
        }

    } catch (error) {
        console.log("Catch Error:", error);
        return res.json({ reply: `Server Error bro: ${error.message}` });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});