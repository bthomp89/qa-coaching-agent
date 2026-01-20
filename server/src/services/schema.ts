/**
 * JSON Schema for structured output from OpenAI Responses API
 * Defines the expected structure for QA review responses
 */
export const QA_REVIEW_JSON_SCHEMA = {
  type: "object",
  properties: {
    criteria: {
      type: "object",
      properties: {
        accuracy: {
          type: "object",
          properties: {
            score: { type: "number", minimum: 1, maximum: 5 },
            notes: { type: "string" }
          },
          required: ["score", "notes"],
          additionalProperties: false
        },
        empathy: {
          type: "object",
          properties: {
            score: { type: "number", minimum: 1, maximum: 5 },
            notes: { type: "string" }
          },
          required: ["score", "notes"],
          additionalProperties: false
        },
        ownership: {
          type: "object",
          properties: {
            score: { type: "number", minimum: 1, maximum: 5 },
            notes: { type: "string" }
          },
          required: ["score", "notes"],
          additionalProperties: false
        },
        clarity: {
          type: "object",
          properties: {
            score: { type: "number", minimum: 1, maximum: 5 },
            notes: { type: "string" }
          },
          required: ["score", "notes"],
          additionalProperties: false
        },
        policy_escalation: {
          type: "object",
          properties: {
            score: { type: "number", minimum: 1, maximum: 5 },
            notes: { type: "string" }
          },
          required: ["score", "notes"],
          additionalProperties: false
        }
      },
      required: ["accuracy", "empathy", "ownership", "clarity", "policy_escalation"],
      additionalProperties: false
    },
    coaching_summary: { type: "string" }
  },
  required: ["criteria", "coaching_summary"],
  additionalProperties: false
} as const;

/**
 * JSON Schema for theme analysis response from OpenAI Responses API
 * Defines the expected structure for theme analysis responses
 */
export const THEME_ANALYSIS_JSON_SCHEMA = {
  type: "object",
  properties: {
    coaching_themes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          theme: { type: "string" },
          reason: { type: "string" }
        },
        required: ["theme", "reason"],
        additionalProperties: false
      },
      minItems: 0,
      maxItems: 3
    }
  },
  required: ["coaching_themes"],
  additionalProperties: false
} as const;
