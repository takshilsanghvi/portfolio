export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') return res.status(405).end();
  const { message, system } = req.body;
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: system + '\n\nUser: ' + message + '\nAssistant:' }] }],
      generationConfig: { maxOutputTokens: 300, temperature: 0.7 }
    })
  });
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return res.status(200).json({ text: JSON.stringify(data) });
  res.status(200).json({ text });
}
