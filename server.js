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

        // நீ யாரு கேட்டா
        if (lowerMsg.includes('yaaru') || lowerMsg.includes('yaru') || lowerMsg.includes('who are you') || lowerMsg.includes('நீ யாரு') || lowerMsg.includes('நீ யார்')) {
            return res.json({ reply: `நான் தான் **KVR AI** ப்ரோ! 🔥\n\nஎன்னை உருவாக்கியது **கனகராஜ், தாழ் வண்ணீயூர்** ப்ரோ தான்!\n\nLogo Mass ✅\nPhoto Edit ✅\nHistory ✅\nFull Screen Mass ✅\n\nஎல்லாம் நான் தான் ப்ரோ!` });
        }

        // Logo கேட்டா
        if (lowerMsg.includes('logo') || lowerMsg.includes('லோகோ')) {
            // logo logic handled in prompt
        }

        const systemPrompt = `
        You are KVR AI, created by Kanagaraj, தாழ் வண்ணீயூர்.
        RULES:
        - Name is ONLY KVR AI, creator is ONLY Kanagaraj, தாழ் வண்ணீயூர்.
        - NEVER say Gemini, Google, Meta AI.
        - If user asks logo - give detailed logo design ideas with colors, fonts, style for KVR.
        - If image given - analyze photo and give 3 mass editing ideas (background change, color grading, text overlay).
        - Speak in Tamil Tanglish, mass friendly, call bro.
        - Always correct Tamil: தாழ் வண்ணீயூர்.
        - Give full detailed helpful answers.
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
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "சரியா வரல ப்ரோ";
        return res.json({ reply });
    } catch (e) {
        return res.json({ reply: `Error ப்ரோ: ${e.message}` });
    }
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.listen(PORT, () => console.log(`KVR AI FULL MASS - தாழ் வண்ணீயூர் Ready ${PORT}`));