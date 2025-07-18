// index.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config(); // Load .env

const app = express();
app.use(cors({ origin: "*", methods: ["POST", "GET"], allowedHeaders: ["Content-Type"] }));
app.use(express.json());

const OPENROUTER_API = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_KEY = process.env.OPENROUTER_KEY;

app.post("/chat", async (req, res) => {
  const { messages } = req.body;

  // 🛡️ Log to verify
  console.log("🔐 OpenRouter key preview:", OPENROUTER_KEY?.slice(0, 10));

  try {
    const response = await fetch(OPENROUTER_API, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openchat/openchat-3.5-0106",
        messages
      })
    });

    const data = await response.json();

    // 🧠 DEBUG: Print full response
    console.log("🚀 Full OpenRouter response:", data);

    // ✅ Safely extract response
    const botReply = data?.choices?.[0]?.message?.content || "⚠️ No valid message in response";
    res.json({ reply: botReply });
  } catch (err) {
    console.error("❌ OpenRouter error:", err);
    res.status(500).json({ error: "Chatbot failed to respond" });
  }
});

app.get("/", (req, res) => {
  res.send("🤖 Chatbot is live");
});

app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});





