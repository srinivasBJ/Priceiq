import Anthropic from '@anthropic-ai/sdk'
import { env } from '../../config/env'

const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY })

export const aiService = {
  async chat(messages: { role: 'user' | 'assistant'; content: string }[], stream: any) {
    const response = await client.messages.stream({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      system: `You are PriceIQ's AI assistant. You help e-commerce merchants 
      optimize their pricing strategy. You have expertise in price elasticity, 
      competitor analysis, and revenue optimization. Be concise and actionable.`,
      messages,
    })

    for await (const chunk of response) {
      if (
        chunk.type === 'content_block_delta' &&
        chunk.delta.type === 'text_delta'
      ) {
        stream.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`)
      }
    }
    stream.write('data: [DONE]\n\n')
    stream.end()
  },

  async getRecommendations(products: any[]) {
    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Analyze these products and give 3 specific pricing recommendations:
          ${JSON.stringify(products, null, 2)}
          Return as JSON array with fields: productId, recommendation, expectedImpact`,
        },
      ],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    try {
      const clean = text.replace(/```json|```/g, '').trim()
      return JSON.parse(clean)
    } catch {
      return []
    }
  },
}