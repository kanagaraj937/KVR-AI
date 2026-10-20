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
    // NEW Google SDK illa, direct REST call - entha model-um work aagum
    const apiKey = process.env.GEMINI_API_KEY;
    const userMessage = req.body.message;

    const prompt = `You are KVR-AI, created by KANAGARAJ. If anyone asks who created you, who made you, unna yaaru uruvakkinathu, enna enna mathi - you MUST say "Enna Kanagaraj than uruvakkinaru bro! Naan KVR-AI". Speak in Tanglish friendly. User: ${userMessage}`;

    // Latest model - 3.8-flash
    const model = "gemini-2.5-flash"; // stable, if fail aana 3.8 try pannum

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    
    if(data.error){
      // 2nd try with 3.8-flash
      const url2 = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;
      const res2 = await fetch(url2, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data2 = await res2.json();
      if(data2.error) throw new Error(data2.error.message);
      return res.json({ reply: data2.candidates[0].content.parts[0].text });
    }

    const reply = data.candidates[0].content.parts[0].text;
    res.json({ reply: reply });

  } catch (e) {
    console.log(e.message);
    res.json({ reply: "Error: " + e.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(10000, '0.0.0.0', () => console.log('KVR-AI LIVE by Kanagaraj'));
