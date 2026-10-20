const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/chat', async (req, res) => {
    try {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(req.body.message);
        res.json({ reply: result.response.text() });
    } catch (e) {
        console.log("ERROR:", e.message);
        res.json({ reply: "Error bro: " + e.message + " - Check API Key" });
    }
});

app.listen(10000, '0.0.0.0', () => console.log('KVR-AI LIVE'));