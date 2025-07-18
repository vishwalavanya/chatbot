// index.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config(); // Load .env file

const app = express();

// ✅ Proper CORS for all origins (for testing)
app.use(cors({
  origin: "*", // Allow all for now
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

const OPENROUTER_API = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_KEY = process.env.OPENROUTER_KEY;

app.post("/chat", async (req, res) => {
  const { messages } = req.body;

  try {
    const response = await fetch(OPENROUTER_API, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY.trim()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openchat/openchat-3.5-0106",
        messages
      })
    });

    const data = await response.json();
    console.log("✅ OpenRouter response:", data);
    res.json(data);
  } catch (err) {
    console.error("❌ OpenRouter error:", err);
    res.status(500).json({ error: "Chatbot backend failed" });
  }
});

// Root route to test Render app is alive
app.get("/", (req, res) => {
  res.send("🤖 OpenRouter backend is running");
});

app.listen(3000, () => {
  console.log("🚀 Backend running on port 3000");
});




