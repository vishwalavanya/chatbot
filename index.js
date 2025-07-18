// index.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config(); // Load env variables from .env file

const app = express();
app.use(cors({ origin: "*", methods: ["POST", "GET"], allowedHeaders: ["Content-Type"] }));
app.use(express.json());

const OPENROUTER_API = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_KEY = process.env.OPENROUTER_KEY?.trim(); // Avoid trailing line breaks

app.post("/chat", async (req, res) => {
  const { messages } = req.body;

  if (!OPENROUTER_KEY) {
    return res.status(500).json({ error: "Missing API key" });
  }

  console.log("🟢 Received:", messages);

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
    console.log("🧠 OpenRouter raw response:", data);

    const reply = data?.choices?.[0]?.message?.content || "⚠️ No valid message in response";
    res.json({ reply });
  } catch (error) {
    console.error("❌ Chatbot error:", error);
    res.status(500).json({ error: "Chatbot failed to respond" });
  }
});

app.get("/", (req, res) => {
  res.send("🤖 OpenRouter Chatbot is live");
});

app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});







