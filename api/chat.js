export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') return res.status(405).end();
  const { message, system } = req.body;
  if (!process.env.GROQ_API_KEY) {
    return res.status(200).json({ text: 'ERROR: GROQ_API_KEY not found' });
  }
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: message }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });
    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) return res.status(200).json({ text: 'GROQ ERROR: ' + JSON.stringify(data) });
    res.status(200).json({ text });
  } catch(e) {
    res.status(200).json({ text: 'EXCEPTION: ' + e.message });
  }
}
