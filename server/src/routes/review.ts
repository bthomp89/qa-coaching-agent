import { Router, Request, Response } from 'express';
import type { ReviewRequest, ReviewResponse } from '../types';
import { generateQAReview } from '../services/openai';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const body: ReviewRequest = req.body;

  // Validation: Check if ticketText is missing or empty
  if (!body.ticketText || typeof body.ticketText !== 'string' || body.ticketText.trim().length === 0) {
    return res.status(400).json({
      error: 'ticketText is required and cannot be empty'
    });
  }

  try {
    const result: ReviewResponse = await generateQAReview(body.ticketText);
    res.json(result);
  } catch (error) {
    console.error('Error generating QA review:', error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes('OPENAI_API_KEY')) {
        return res.status(500).json({
          error: 'OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.'
        });
      }
      
      if (error.message.includes('Unable to generate valid review response')) {
        return res.status(500).json({
          error: 'Unable to generate valid review response. Please try again.'
        });
      }
    }

    // Generic error response (don't expose internal details)
    res.status(500).json({
      error: 'An error occurred while generating the QA review. Please try again.'
    });
  }
});

export default router;
