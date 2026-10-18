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
            return res.json({ reply: "API Key Illa thambi! Render Environment-la Key Add pannala!" });
        }

        console.log("Message vanthuchu:", message);

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }]
            })
        });

        const data = await response.json();
        console.log("Gemini Full Response:", JSON.stringify(data));

        if (data.error) {
            return res.json({ reply: `API Error thambi: ${data.error.message}` });
        }

        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const reply = data.candidates[0].content.parts[0].text;
            return res.json({ reply: reply });
        } else {
            return res.json({ reply: `Data sariya varala thambi: ${JSON.stringify(data).substring(0, 200)}` });
        }

    } catch (error) {
        console.log("Catch Error:", error);
        return res.json({ reply: `Server Error thambi: ${error.message}` });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});