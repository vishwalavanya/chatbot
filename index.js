// index.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config(); // ✅ Load environment variables from .env

const app = express();

// ✅ CORS: Allow all origins (development-safe)
app.use(cors({
  origin: "*",
  methods: ["POST", "GET"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

const OPENROUTER_API = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_KEY = process.env.OPENROUTER_KEY?.trim(); // ✅ Avoid accidental space/linebreak

// ✅ POST endpoint to handle user chat
app.post("/chat", async (req, res) => {
  const { messages } = req.body;

  console.log("🔐 Loaded OpenRouter key:", OPENROUTER_KEY ? "[FOUND]" : "[MISSING]");
  console.log("📝 Incoming messages:", messages);

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
    console.log("🚀 Full OpenRouter response:", data);

    const botReply = data?.choices?.[0]?.message?.content || "⚠️ No valid message in response";
    res.json({ reply: botReply });
  } catch (err) {
    console.error("❌ OpenRouter error:", err);
    res.status(500).json({ error: "Chatbot failed to respond" });
  }
});

// ✅ Basic GET route
app.get("/", (req, res) => {
  res.send("🤖 Chatbot is live");
});

// ✅ Start server
app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});






