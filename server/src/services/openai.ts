import OpenAI from 'openai';
import type { ReviewResponse } from '../types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const REQUIRED_CRITERIA = ['accuracy', 'empathy', 'ownership', 'clarity', 'policy_escalation'] as const;

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

const SYSTEM_MESSAGE = `You are a QA coach evaluating customer support ticket responses. Score each ticket across 5 criteria on a scale of 1-5 (allowing .5 increments).

CRITERIA DEFINITIONS:

1. ACCURACY (Technical Correctness)
   - Score 1: Information is incorrect, misleading, or harmful. Troubleshooting steps don't address the issue.
   - Score 2: Some information is correct but incomplete or partially incorrect. Steps may be outdated or not relevant.
   - Score 3: Information is generally correct but missing important details. Steps are reasonable but could be more thorough.
   - Score 4: Information is accurate and comprehensive. Troubleshooting steps are appropriate and well-researched.
   - Score 5: Information is completely accurate and demonstrates deep technical understanding. Steps are optimal and consider edge cases.

2. EMPATHY (Customer Understanding & Compassion)
   - Score 1: No acknowledgment of customer feelings or situation. Dismissive or robotic tone.
   - Score 2: Minimal acknowledgment but lacks genuine understanding. Tone is transactional.
   - Score 3: Acknowledges customer concerns but doesn't fully understand emotional impact. Tone is professional but detached.
   - Score 4: Shows clear understanding of customer emotions and situation. Tone is warm and supportive.
   - Score 5: Exceptional empathy. Deeply understands customer's situation and emotional state. Tone is compassionate and personalized.

3. OWNERSHIP (Responsibility & Follow-through)
   - Score 1: Avoids responsibility, blames customer or other teams. No follow-through.
   - Score 2: Takes minimal responsibility. Follow-through is inconsistent or unclear.
   - Score 3: Takes responsibility for resolution but follow-through could be better. Some handoffs are unclear.
   - Score 4: Takes clear ownership and follows through consistently. Clear next steps provided.
   - Score 5: Exceptional ownership. Proactive follow-up and takes full responsibility for resolution path.

4. CLARITY (Communication Quality)
   - Score 1: Communication is confusing, unclear, or difficult to understand. No structure.
   - Score 2: Some clarity but hard to follow. Structure is poor or missing.
   - Score 3: Generally clear but could be more concise or better organized. Instructions are understandable.
   - Score 4: Clear and well-structured communication. Instructions are easy to follow.
   - Score 5: Exceptionally clear and well-organized. Instructions are crystal clear and easy to execute.

5. POLICY/ESCALATION (Policy Adherence & Timing)
   - Score 1: Violates policies or escalates inappropriately. No understanding of when to escalate.
   - Score 2: Some policy violations or escalates too late/inappropriately. Basic understanding but errors.
   - Score 3: Generally follows policies but timing could be better. Escalation is appropriate but delayed.
   - Score 4: Follows policies correctly and escalates at appropriate times. Good judgment.
   - Score 5: Exemplary policy adherence and perfect escalation timing. Shows excellent judgment.

INSTRUCTIONS:
- Read the entire ticket context carefully
- Score each criterion from 1-5 (whole numbers or .5 increments like 1.5, 2.5, etc.)
- For each criterion, provide detailed notes explaining:
  * Why the score was given (what was observed)
  * What could be done to improve the score (specific, actionable feedback)
- Provide a 2-3 sentence coaching summary that is actionable and highlights key areas for improvement

OUTPUT FORMAT:
You MUST return valid JSON only (no markdown, no code blocks, no extra text). The JSON must match this exact schema:

{
  "criteria": {
    "accuracy": { "score": 1-5, "notes": "..." },
    "empathy": { "score": 1-5, "notes": "..." },
    "ownership": { "score": 1-5, "notes": "..." },
    "clarity": { "score": 1-5, "notes": "..." },
    "policy_escalation": { "score": 1-5, "notes": "..." }
  },
  "coaching_summary": "2-3 sentences, actionable"
}`;

function validateScore(score: number): boolean {
  // Allow whole numbers and .5 increments from 1 to 5
  if (score < 1 || score > 5) return false;
  const decimalPart = score % 1;
  return decimalPart === 0 || decimalPart === 0.5;
}

function validateResponse(data: any): data is QAResponseSchema {
  if (!data || typeof data !== 'object') return false;
  
  if (!data.criteria || typeof data.criteria !== 'object') return false;
  if (typeof data.coaching_summary !== 'string' || data.coaching_summary.trim().length === 0) return false;

  // Check all required criteria are present
  for (const criterion of REQUIRED_CRITERIA) {
    if (!data.criteria[criterion]) return false;
    const criterionData = data.criteria[criterion];
    if (typeof criterionData !== 'object') return false;
    if (!validateScore(criterionData.score)) return false;
    if (typeof criterionData.notes !== 'string' || criterionData.notes.trim().length === 0) return false;
  }

  return true;
}

function parseJSONResponse(content: string): QAResponseSchema | null {
  try {
    // Try to extract JSON from markdown code blocks if present
    let jsonString = content.trim();
    
    // Remove markdown code block syntax if present
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    const parsed = JSON.parse(jsonString);
    return validateResponse(parsed) ? parsed : null;
  } catch (error) {
    return null;
  }
}

export async function generateQAReview(ticketText: string): Promise<ReviewResponse> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  const userMessage = `Please evaluate the following support ticket and provide scores and feedback according to the rubric:\n\n${ticketText}`;

  // First attempt
  let completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SYSTEM_MESSAGE },
      { role: 'user', content: userMessage }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.4
  });

  let responseContent = completion.choices[0]?.message?.content;
  if (!responseContent) {
    throw new Error('No response content from OpenAI API');
  }

  let parsedResponse = parseJSONResponse(responseContent);

  // If validation fails, attempt one repair
  if (!parsedResponse) {
    const repairMessage = `The previous response was not valid JSON. Please return ONLY valid JSON (no markdown, no code blocks, no explanations) matching this exact schema:\n\n{\n  "criteria": {\n    "accuracy": { "score": 1-5, "notes": "..." },\n    "empathy": { "score": 1-5, "notes": "..." },\n    "ownership": { "score": 1-5, "notes": "..." },\n    "clarity": { "score": 1-5, "notes": "..." },\n    "policy_escalation": { "score": 1-5, "notes": "..." }\n  },\n  "coaching_summary": "2-3 sentences, actionable"\n}`;

    completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_MESSAGE },
        { role: 'user', content: userMessage },
        { role: 'assistant', content: responseContent },
        { role: 'user', content: repairMessage }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3
    });

    responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No response content from OpenAI API on repair attempt');
    }

    parsedResponse = parseJSONResponse(responseContent);

    if (!parsedResponse) {
      throw new Error('Unable to generate valid review response after retry');
    }
  }

  // Transform to ReviewResponse format (already matches the schema)
  return {
    criteria: parsedResponse.criteria,
    coaching_summary: parsedResponse.coaching_summary
  };
}
