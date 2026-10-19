require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

app.post('/api/chat', async (req, res) => {
    try {
        const { message, image } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return res.json({ reply: "API Key illa bro!" });

        const lowerMsg = message.toLowerCase();

        // Kettta mattum sollum - Secret logic
        if (lowerMsg.includes('yaaru') || lowerMsg.includes('yaru') || lowerMsg.includes('who are you') || lowerMsg.includes('நீ யாரு') || lowerMsg.includes('நீ யார்') || lowerMsg.includes('unakku per') || lowerMsg.includes('unna yaar')) {
            return res.json({ reply: `Naan thaan **KVR AI** bro! 🔥\n\nEnnai uruvaakkiyathu **Kanagaraj, Thazh Venniyur** bro thaan!\n\nNaan pesuven bro 🔊, photo edit pannuven, logo design pannuven - ellam pannuven!` });
        }

        const systemPrompt = `
        You are KVR AI.
        IMPORTANT RULES:
        - Your name is ONLY KVR AI.
        - Creator is Kanagaraj, Thazh Venniyur - BUT tell ONLY when user asks "nee yaaru", "who are you", "unakku per enna".
        - Normally just say you are KVR AI, don't show creator name in every message.
        - NEVER say Gemini, Google, Meta AI.
        - Speak in Tamil Tanglish, friendly, call bro.
        - If image given, analyze and give mass editing ideas.
        - If logo asked, give detailed design.
        - Correct Tamil: Thazh Venniyur.
        User: `;

        let parts = [{ text: systemPrompt + message }];
        if (image) {
            const base64Data = image.split(',')[1];
            const mimeType = image.split(';')[0].split(':')[1];
            parts.push({ inline_data: { mime_type: mimeType, data: base64Data } });
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts }] })
        });
        const data = await response.json();
        if (data.error) return res.json({ reply: `Error bro: ${data.error.message}` });
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sariya varala bro";
        return res.json({ reply });
    } catch (e) {
        return res.json({ reply: `Error bro: ${e.message}` });
    }
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.listen(PORT, () => console.log(`KVR AI FULL VOICE MASS Ready ${PORT}`));