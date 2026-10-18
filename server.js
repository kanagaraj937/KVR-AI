require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Gemini API Chat Route
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: "API Key Illa" });
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }]
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0]) {
            res.json({ reply: data.candidates[0].content.parts[0].text });
        } else {
            res.json({ reply: "Ennakku puriyala thambi, thirumba kelu!" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server Error" });
    }
});

// Website-a Kaamikira Route - Idhu thaan mukkiyam!
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});