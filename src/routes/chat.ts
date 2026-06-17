import { Router } from 'express';

const router = Router();

router.post('/', async (req, res) => {
  const { message } = req.body;
  if (!message?.trim()) return res.status(400).json({ error: 'Message required' });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system: `You are AgroSmart Assistant, a helpful AI for Ghanaian smallholder farmers and crop buyers.
Answer questions about crop diseases, buying and selling produce, using the AgroSmart app, and farming tips relevant to Ghana.
Focus on tomato, maize, and cassava farming. Keep answers short, simple, and practical.
If a question is outside agriculture or AgroSmart, politely say you can only help with farming and app-related questions.`,
        messages: [{ role: 'user', content: message }],
      }),
    });

    const data = await response.json() as { content: { text: string }[] };
    res.json({ reply: data.content[0].text });
  } catch {
    res.status(500).json({ error: 'AI unavailable. Please try again.' });
  }
});

export default router;