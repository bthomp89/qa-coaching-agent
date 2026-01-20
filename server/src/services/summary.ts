import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables before creating the OpenAI client
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SUMMARY_SYSTEM_MESSAGE = `You are a support ticket analyzer. Your task is to read support ticket conversations and summarize WHAT happened - the factual events, issues, and resolution path - in exactly 3 sentences.

IMPORTANT GUIDELINES:
- Focus ONLY on WHAT happened, not on how well the agent performed
- Do NOT evaluate agent performance, tone, or quality
- Do NOT provide feedback or coaching
- Focus on the customer's issue, the steps taken to resolve it, and the outcome
- Write exactly 3 sentences, no more, no less
- Never use actual names from the ticket - always refer to "the Customer" and "the Agent"
- Be concise and factual
- If the issue is unresolved, note what steps were taken and what remains pending`;

export async function generateInteractionSummary(ticketText: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  // Input validation: limit ticket text length to prevent excessive costs
  const MAX_TICKET_LENGTH = 10000;
  if (ticketText.length > MAX_TICKET_LENGTH) {
    throw new Error(`Ticket text exceeds maximum length of ${MAX_TICKET_LENGTH} characters. Please shorten the input.`);
  }

  const userMessage = `Please summarize what happened in the following support ticket conversation in exactly 3 sentences. Focus on the factual events - the customer's issue, the steps taken, and the resolution path. Do NOT evaluate the agent's performance.\n\n${ticketText}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SUMMARY_SYSTEM_MESSAGE },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.3, // Lower temperature for more factual, consistent output
      max_tokens: 200, // 3 sentences should be well under 200 tokens
    });

    const summary = response.choices[0]?.message?.content?.trim();
    if (!summary) {
      throw new Error('No summary content returned from OpenAI API');
    }

    return summary;
  } catch (apiError: any) {
    console.error('[OpenAI API] Error generating interaction summary:', apiError);
    console.error('[OpenAI API] Error details:', {
      message: apiError?.message,
      status: apiError?.status,
      code: apiError?.code,
      type: apiError?.type
    });
    throw new Error(`OpenAI API error generating summary: ${apiError?.message || 'Unknown error occurred'}`);
  }
}
