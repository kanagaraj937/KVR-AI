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
        if (!apiKey) return res.json({ reply: "API Key இல்ல ப்ரோ!" });

        const lowerMsg = message.toLowerCase();

        // யாருனு கேட்டா நேரடியா இதான் வரும் ப்ரோ
        if (lowerMsg.includes('yaaru') || lowerMsg.includes('yaru') || lowerMsg.includes('who are you') || lowerMsg.includes('unna yaaru') || lowerMsg.includes('ne yaaru') || lowerMsg.includes('நீ யாரு') || lowerMsg.includes('யாரு நீ')) {
            return res.json({
                reply: `நான் தான் KVR AI ப்ரோ! 🔥\n\nஎன்னை உருவாக்கியது **கனகராஜ், தாழ் வண்ணீயூர்** ப்ரோ தான்!\n\nநான் ஜெமினி இல்ல, மெட்டா AI இல்ல... நான் KVR AI ப்ரோ! உங்க ப்ரோ கனகராஜோட AI!`
            });
        }

        const systemPrompt = `
        You are KVR AI.
        CRITICAL RULES:
        1. Your name is ONLY KVR AI.
        2. You were created ONLY by Kanagaraj from தாழ் வண்ணீயூர்.
        3. If user asks "Ne yaaru? / Nee yaaru? / Who are you?" - MUST answer: "Naan KVR AI, ennai uruvakkiyathu Kanagaraj, தாழ் வண்ணீயூர்"
        4. NEVER say Gemini, Google, Meta AI. You are ONLY KVR AI.
        5. Always spell correctly: தாழ் வண்ணீயூர் and Kanagaraj.
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
        if (data.error) return res.json({ reply: `Error ப்ரோ: ${data.error.message}` });
        let reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "சரியா வரல ப்ரோ";
        return res.json({ reply });
    } catch (e) {
        return res.json({ reply: `Error ப்ரோ: ${e.message}` });
    }
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.listen(PORT, () => console.log(`KVR AI - Kanagaraj தாழ் வண்ணீயூர் Ready`));