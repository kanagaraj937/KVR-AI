const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/chat', async (req, res) => {
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // NEW MODEL - 100% Working
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const userMessage = req.body.message;

    // KANAGARAJ PROMPT - Ithu than mukkiyam bro!
    const finalPrompt = `
    You are KVR-AI.
    You were created by KANAGARAJ.
    If anyone asks "unna yaaru uruvakkinathu?" or "who created you?" or "enna enna mathi" you MUST answer: "Enna Kanagaraj than uruvakkinaru bro! Naan KVR-AI"
    You are friendly, you speak in Tanglish (Tamil + English mix) like a bro.
    User question: ${userMessage}
    `;

    const result = await model.generateContent(finalPrompt);
    res.json({ reply: result.response.text() });

  } catch (e) {
    console.log(e.message);
    res.json({ reply: "Error bro: " + e.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(10000, '0.0.0.0', () => console.log('KVR-AI LIVE - Kanagaraj Created'));
