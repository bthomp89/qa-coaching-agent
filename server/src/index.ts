import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import reviewRouter from './routes/review';
import themeAnalysisRouter from './routes/theme-analysis';

// Load environment variables from server/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// CORS configuration: Support both local development and production
// Allow multiple origins for flexibility
const allowedOrigins = CLIENT_URL.includes(',')
  ? CLIENT_URL.split(',').map(url => url.trim())
  : [CLIENT_URL];

// Middleware
app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.some(allowedOrigin => {
      // Support exact match or pattern matching for localhost
      if (allowedOrigin === origin) return true;
      // Allow localhost with any port for development
      if (allowedOrigin.includes('localhost') && origin.includes('localhost')) return true;
      return false;
    })) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/review', reviewRouter);
app.use('/api/theme-analysis', themeAnalysisRouter);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`CORS enabled for: ${CLIENT_URL}`);
});
