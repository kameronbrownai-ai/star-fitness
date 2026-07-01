import express from 'express'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'

const app = express()
const PORT = process.env.PORT || 3001
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }))
app.use(express.json({ limit: '10mb' }))

app.post('/chat', async (req, res) => {
  try {
    const { messages, system, hasVision } = req.body
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array required' })
    }

    const model = hasVision ? 'claude-sonnet-4-6' : 'claude-haiku-4-5-20251001'
    const max_tokens = hasVision ? 1024 : 800

    const response = await client.messages.create({
      model,
      max_tokens,
      system: system || '',
      messages: messages.filter(m => m.role !== 'system'),
    })

    res.json(response)
  } catch (err) {
    console.error('Chat error:', err.message)
    res.status(500).json({ error: 'Failed to generate response' })
  }
})

app.get('/health', (_, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => console.log(`Star Fitness AI server running on port ${PORT}`))
