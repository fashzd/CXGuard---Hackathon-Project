import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = Number(process.env.FORWARDER_PORT || 8000);
const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
const apiKey = process.env.OPENAI_API_KEY;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    model,
    has_api_key: Boolean(apiKey)
  });
});

app.post("/v1/chat/completions", async (req, res) => {
  if (!apiKey) {
    return res.status(500).json({
      error: {
        message: "OPENAI_API_KEY is not configured on the forwarder.",
        type: "configuration_error"
      }
    });
  }

  try {
    const client = new OpenAI({ apiKey });
    const body = req.body ?? {};

    const completion = await client.chat.completions.create({
      model: typeof body.model === "string" ? body.model : model,
      messages: Array.isArray(body.messages) ? body.messages : [],
      temperature: typeof body.temperature === "number" ? body.temperature : 0.2,
      max_tokens: typeof body.max_tokens === "number" ? body.max_tokens : undefined,
      stream: false
    });

    return res.json(completion);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown OpenAI error";

    return res.status(502).json({
      error: {
        message: `Forwarder failed to complete chat request: ${message}`,
        type: "upstream_error"
      }
    });
  }
});

app.listen(port, () => {
  console.log(`CXGuard forwarder listening on http://localhost:${port}`);
});
