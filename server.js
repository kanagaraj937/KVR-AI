const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname)));

// MODELS LIST - Oru model busy na adutha model try pannum bro!
const MODELS = [
    "gemini-1.5-flash",
    "gemini-1.5-pro"
];

async function callGemini(prompt, imageBase64) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("API Key illa bro!");

    let lastError = null;

    for (const model of MODELS) {
        try {
            console.log(`Trying model: ${model} bro!`);
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

            let parts = [{ text: prompt }];
            if (imageBase64) {
                const base64Data = imageBase64.split(',')[1];
                const mimeType = imageBase64.match(/data:(.*);base64/)[1] || 'image/jpeg';
                parts.push({ inline_data: { mime_type: mimeType, data: base64Data } });
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts }],
                    generationConfig: { temperature: 0.9, maxOutputTokens: 1000 }
                })
            });

            const data = await response.json();

            if (data.error) {
                console.log(`${model} error:`, data.error.message);
                lastError = data.error.message;
                continue; // Adutha model try pannu
            }

            if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
                console.log(`Success with ${model} bro!`);
                return data.candidates[0].content.parts[0].text;
            }

        } catch (err) {
            console.log(`${model} failed:`, err.message);
            lastError = err.message;
            continue;
        }
    }

    throw new Error(lastError || "All models busy bro!");
}

app.post('/api/chat', async (req, res) => {
    const { message, image } = req.body;
    if (!message && !image) return res.json({ reply: "Enna bro kekanum? Sollu bro!" });

    // KVR AI PERSONALITY - Thazh Venniyur!
    const systemPrompt = `
Nee KVR AI bro! Unna create pannathu Kanagaraj Thazh Venniyur la irunthu! 
Nee Kanagaraj oda best friend! Neenga rendu perum Thazh Venniyur karanga!
Un style: Tamil + Tanglish la friendly-a pesanum, bro nu koopidanum.
Un oor Thazh Venniyur bro! Adha perumaya sollanum!
Question: ${message}
Nee bro style la, short-a, mass-a pathil sollu bro!
`;

    try {
        const reply = await callGemini(systemPrompt, image);
        res.json({ reply });
    } catch (err) {
        console.error("Final Error:", err.message);
        // Busy na kooda oru nalla pathil kudu
        if (err.message.includes("high demand") || err.message.includes("quota") || err.message.includes("429")) {
            res.json({ reply: "Broo! 🤯 Gemini konjam busy bro! 10 second kalichu thirumba kelu bro! Server semma hot-a irukku ippo! Thazh Venniyur la irunthu naan ready-a irukken!" });
        } else {
            res.json({ reply: `Error bro: ${err.message}. Konjam neram kalichu try pannu bro!` });
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`KVR AI Running on ${PORT} - Thazh Venniyur Mass!`));