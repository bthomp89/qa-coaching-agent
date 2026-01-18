import { Router, Request, Response } from 'express';
import type { ReviewRequest, ReviewResponse } from '../types';

const router = Router();

// Mock QAResult data matching the frontend schema
const mockQAResult: ReviewResponse = {
  criteria: {
    Empathy: {
      score: 4,
      notes: 'Good acknowledgment of customer urgency, but could show more understanding of the business impact (SOC 2 audit context).'
    },
    'Technical Accuracy': {
      score: 3,
      notes: 'Suggested troubleshooting steps were reasonable but repetitive. Failed to investigate the previous incident mentioned by customer.'
    },
    'Resolution Path': {
      score: 3,
      notes: 'Agent escalated appropriately only after customer insisted. Should have escalated earlier given the severity (Sev 1) and business impact.'
    },
    'Escalation Timing': {
      score: 2,
      notes: 'Escalation occurred too late in the conversation. A Sev 1 issue affecting critical audit processes should trigger immediate escalation.'
    },
    Documentation: {
      score: 4,
      notes: 'Requested relevant user data, but should have asked about the previous incident details earlier in the conversation.'
    }
  },
  coaching_summary: 'The agent demonstrated basic troubleshooting skills and eventually escalated, but missed several key opportunities. The customer explicitly mentioned a prior similar incident (race condition in role evaluation engine), which should have been the first thing investigated rather than suggesting token regeneration. Given the SOC 2 audit context and Sev 1 classification, escalation should have happened immediately after the first response indicated an ongoing critical issue affecting compliance. The agent should proactively acknowledge the prior incident and check internal systems for known issues before asking the customer to retry steps they\'ve already completed.'
};

router.post('/', (req: Request, res: Response) => {
  const body: ReviewRequest = req.body;

  // Validation: Check if ticketText is missing or empty
  if (!body.ticketText || typeof body.ticketText !== 'string' || body.ticketText.trim().length === 0) {
    return res.status(400).json({
      error: 'ticketText is required and cannot be empty'
    });
  }

  // Return mocked QAResult response
  res.json(mockQAResult);
});

export default router;
