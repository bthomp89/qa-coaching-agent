export interface RubricDefinition {
  title: string
  description: string
  scores: {
    score: number
    description: string
  }[]
}

export const RUBRICS: Record<string, RubricDefinition> = {
  accuracy: {
    title: 'Accuracy (Technical Correctness)',
    description: 'Evaluates the technical accuracy and correctness of the information provided.',
    scores: [
      {
        score: 1,
        description: "Information is incorrect, misleading, or harmful. Troubleshooting steps don't address the issue."
      },
      {
        score: 2,
        description: 'Some information is correct but incomplete or partially incorrect. Steps may be outdated or not relevant.'
      },
      {
        score: 3,
        description: 'Information is generally correct but missing important details. Steps are reasonable but could be more thorough.'
      },
      {
        score: 4,
        description: 'Information is accurate and comprehensive. Troubleshooting steps are appropriate and well-researched.'
      },
      {
        score: 5,
        description: 'Information is completely accurate and demonstrates deep technical understanding. Steps are optimal and consider edge cases.'
      }
    ]
  },
  empathy: {
    title: 'Empathy (Customer Understanding & Compassion)',
    description: 'Evaluates the agent\'s ability to understand and acknowledge the customer\'s emotional state and situation.',
    scores: [
      {
        score: 1,
        description: 'No acknowledgment of customer feelings or situation. Dismissive or robotic tone.'
      },
      {
        score: 2,
        description: 'Minimal acknowledgment but lacks genuine understanding. Tone is transactional.'
      },
      {
        score: 3,
        description: 'Acknowledges customer concerns but doesn\'t fully understand emotional impact. Tone is professional but detached.'
      },
      {
        score: 4,
        description: 'Shows clear understanding of customer emotions and situation. Tone is warm and supportive.'
      },
      {
        score: 5,
        description: 'Exceptional empathy. Deeply understands customer\'s situation and emotional state. Tone is compassionate and personalized.'
      }
    ]
  },
  ownership: {
    title: 'Ownership (Responsibility & Follow-through)',
    description: 'Evaluates the agent\'s willingness to take responsibility and follow through with resolution.',
    scores: [
      {
        score: 1,
        description: 'Avoids responsibility, blames customer or other teams. No follow-through.'
      },
      {
        score: 2,
        description: 'Takes minimal responsibility. Follow-through is inconsistent or unclear.'
      },
      {
        score: 3,
        description: 'Takes responsibility for resolution but follow-through could be better. Some handoffs are unclear.'
      },
      {
        score: 4,
        description: 'Takes clear ownership and follows through consistently. Clear next steps provided.'
      },
      {
        score: 5,
        description: 'Exceptional ownership. Proactive follow-up and takes full responsibility for resolution path.'
      }
    ]
  },
  clarity: {
    title: 'Clarity (Communication Quality)',
    description: 'Evaluates how clear, well-structured, and easy to understand the communication is.',
    scores: [
      {
        score: 1,
        description: 'Communication is confusing, unclear, or difficult to understand. No structure.'
      },
      {
        score: 2,
        description: 'Some clarity but hard to follow. Structure is poor or missing.'
      },
      {
        score: 3,
        description: 'Generally clear but could be more concise or better organized. Instructions are understandable.'
      },
      {
        score: 4,
        description: 'Clear and well-structured communication. Instructions are easy to follow.'
      },
      {
        score: 5,
        description: 'Exceptionally clear and well-organized. Instructions are crystal clear and easy to execute.'
      }
    ]
  },
  policy_escalation: {
    title: 'Policy/Escalation (Policy Adherence & Timing)',
    description: 'Evaluates adherence to company policies and appropriateness of escalation timing.',
    scores: [
      {
        score: 1,
        description: 'Violates policies or escalates inappropriately. No understanding of when to escalate.'
      },
      {
        score: 2,
        description: 'Some policy violations or escalates too late/inappropriately. Basic understanding but errors.'
      },
      {
        score: 3,
        description: 'Generally follows policies but timing could be better. Escalation is appropriate but delayed.'
      },
      {
        score: 4,
        description: 'Follows policies correctly and escalates at appropriate times. Good judgment.'
      },
      {
        score: 5,
        description: 'Exemplary policy adherence and perfect escalation timing. Shows excellent judgment.'
      }
    ]
  }
}

// Helper function to format criterion name for display
export function formatCriterionName(criterion: string): string {
  return criterion
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}
