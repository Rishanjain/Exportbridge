const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { businessProfile, product, market } = req.body;

  if (!businessProfile || !product || !market) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const prompt = `You are an expert international trade consultant.
Business Profile: ${businessProfile}
Product: ${product}
Target Market: ${market}

Respond ONLY with valid JSON (no markdown):
{
  "score": <0-100>,
  "summary": "<2-3 line Hindi-English summary>",
  "breakdown": [
    {"factor": "Market Demand", "score": <0-100>, "note": "<short note>"},
    {"factor": "Product Competitiveness", "score": <0-100>, "note": "<short note>"},
    {"factor": "Business Readiness", "score": <0-100>, "note": "<short note>"},
    {"factor": "Regulatory Ease", "score": <0-100>, "note": "<short note>"},
    {"factor": "Profit Potential", "score": <0-100>, "note": "<short note>"}
  ],
  "topOpportunity": "<1 line>",
  "topRisk": "<1 line>",
  "nextStep": "<1 line>"
}`;

  const API_KEY = "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";

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API Error: ${response.statusText}`);
    }

    const result = await response.json();
    const raw = result.choices[0].message.content;
    const clean = raw.replace(/```json|```/g, "").trim();
    
    res.json(JSON.parse(clean));
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Failed to generate analysis' });
  }
});

module.exports = router;
