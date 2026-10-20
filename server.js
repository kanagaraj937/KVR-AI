const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/chat', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const userMsg = req.body.message;

  const prompt = `You are KVR-AI created by KANAGARAJ. If user asks unna yaaru uruvakkinathu, who created you, enna enna mathi - MUST reply "Enna Kanagaraj than uruvakkinaru bro! Naan KVR-AI". Speak Tanglish friendly. User: ${userMsg}`;

  // 4 model list - onnu fail aana aduthathu try pannum
  const models = [
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash-lite", 
    "gemini-1.5-flash-8b",
    "gemini-flash-latest"
  ];

  for (let model of models) {
    try {
      console.log(`Trying ${model}...`);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      
      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      
      const d = await r.json();
      
      if (d.candidates && d.candidates[0]) {
        const reply = d.candidates[0].content.parts[0].text;
        console.log(`Success with ${model}`);
        return res.json({ reply: reply });
      }
      console.log(`Failed ${model}:`, d.error?.message);
    } catch (e) {
      console.log(`Error ${model}:`, e.message);
    }
  }

  res.json({ reply: "Bro server busy-ah irukku, 1 min kazhichu 'hi' nu thiruppi anuppu bro! Kanagaraj KVR-AI ready!" });
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(10000, '0.0.0.0', () => console.log('KVR-AI LIVE by Kanagaraj'));
