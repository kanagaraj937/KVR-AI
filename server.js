require("dotenv").config({
    path: __dirname + "/.env"
});
console.log(
    "API Key loaded:",
    Boolean(process.env.GEMINI_API_KEY)
);
const express = require("express");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.post("/api/chat", async (req, res) => {
    try {
        const message = req.body.message;

        const response = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite",
            contents: message
        });

        res.json({
            reply: response.text
        });

    } catch (error) {
        console.error("Gemini error:", error.message);

        res.status(500).json({
            reply: "மன்னிக்கவும்! AI இணைப்பில் சிக்கல் ஏற்பட்டுள்ளது. மீண்டும் முயற்சி செய்யுங்கள்."
        });
    }
});

app.listen(PORT, () => {
    console.log("KVR AI running at http://localhost:3000");
});