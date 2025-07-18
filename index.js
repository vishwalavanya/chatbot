import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const OPENROUTER_API = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_KEY = "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";

app.post("/chat", async (req, res) => {
  const { messages } = req.body;

  try {
    const response = await fetch(OPENROUTER_API, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openchat/openchat-3.5-0106", // or "openai/gpt-3.5-turbo"
        messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ OpenRouter API returned an error:", data);
      return res.status(response.status).json({ error: data });
    }

    console.log("📦 OpenRouter API response:", data);

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

