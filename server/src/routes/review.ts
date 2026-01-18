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
    // Enhanced error logging for debugging
    console.error('Error generating QA review:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes('OPENAI_API_KEY')) {
        return res.status(500).json({
          error: 'OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.'
        });
      }
      
      if (error.message.includes('Ticket text exceeds maximum length')) {
        return res.status(400).json({
          error: error.message
        });
      }
      
      if (error.message.includes('Unable to generate valid review response')) {
        return res.status(500).json({
          error: 'Unable to generate valid review response. Please try again.'
        });
      }

      // For development: include error message for better debugging
      // In production, you might want to hide this
      if (process.env.NODE_ENV === 'development') {
        return res.status(500).json({
          error: 'An error occurred while generating the QA review. Please try again.',
          details: error.message
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
