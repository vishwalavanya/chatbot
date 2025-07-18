import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());

const OPENROUTER_API = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_KEY = process.env.OPENROUTER_KEY;

if (!OPENROUTER_KEY) {
  console.error("❌ Missing OPENROUTER_KEY. Please set it in Render environment.");
  process.exit(1);
}

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
    console.log("🤖 Response from OpenRouter:", data);
    res.json(data);
  } catch (err) {
    console.error("❌ Error with OpenRouter:", err);
    res.status(500).json({ error: "Failed to connect to OpenRouter" });
  }
});

app.get("/", (req, res) => {
  res.send("🤖 OpenRouter Chatbot API is live");
});

app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});



