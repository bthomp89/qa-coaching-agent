import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import type { ReviewResponse } from '../types';
import { SYSTEM_MESSAGE } from './prompts';
import { QA_REVIEW_JSON_SCHEMA } from './schema';

// Load environment variables before creating the OpenAI client
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface CriteriaScore {
  score: number;
  notes: string;
}

interface QAResponseSchema {
  criteria: {
    accuracy: CriteriaScore;
    empathy: CriteriaScore;
    ownership: CriteriaScore;
    clarity: CriteriaScore;
    policy_escalation: CriteriaScore;
  };
  coaching_summary: string;
}

export async function generateQAReview(ticketText: string): Promise<ReviewResponse> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  // Input validation: limit ticket text length to prevent excessive costs
  // ~10,000 characters ≈ ~2,500 tokens (roughly $0.004 in input costs)
  const MAX_TICKET_LENGTH = 10000;
  if (ticketText.length > MAX_TICKET_LENGTH) {
    throw new Error(`Ticket text exceeds maximum length of ${MAX_TICKET_LENGTH} characters. Please shorten the input.`);
  }

  const userMessage = `Please evaluate the following support ticket and provide scores and feedback according to the rubric:\n\n${ticketText}`;

  let response;
  try {
    response = await openai.responses.create({
      model: 'gpt-4o-mini',
      input: [
        { role: 'system', content: SYSTEM_MESSAGE },
        { role: 'user', content: userMessage }
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'qa_review_response',
          description: 'QA review response with scores and coaching feedback',
          schema: QA_REVIEW_JSON_SCHEMA,
          strict: true
        }
      },
      // Limit output tokens to prevent excessive costs
      // 2000 tokens ≈ ~$0.028 max output cost per request
      // This is more than enough for structured JSON response (typically 300-800 tokens)
      max_output_tokens: 2000
    });
  } catch (apiError: any) {
    console.error('[OpenAI API] Error calling responses.create:', apiError);
    console.error('[OpenAI API] Error details:', {
      message: apiError?.message,
      status: apiError?.status,
      code: apiError?.code,
      type: apiError?.type
    });
    throw new Error(`OpenAI API error: ${apiError?.message || 'Unknown error occurred'}`);
  }

  const responseContent = response.output_text;
  if (!responseContent) {
    throw new Error('No response content from OpenAI Responses API');
  }

  // Parse the structured JSON response
  let parsedResponse: QAResponseSchema;
  try {
    parsedResponse = JSON.parse(responseContent);
  } catch (error) {
    console.error('[OpenAI API] Failed to parse response:', error);
    throw new Error('Failed to parse response from OpenAI Responses API');
  }

  // The structured output should already match the schema, but we verify the structure
  if (!parsedResponse.criteria || !parsedResponse.coaching_summary) {
    throw new Error('Invalid response structure from OpenAI Responses API');
  }

  // Transform to ReviewResponse format (already matches the schema)
  const result = {
    criteria: parsedResponse.criteria,
    coaching_summary: parsedResponse.coaching_summary
  };

  return result;
}
