# QA Coaching Agent

A web application for analyzing and providing feedback on QA support tickets.

## Project Structure

- `/src` - Frontend React application (Vite + TypeScript)
- `/server` - Backend Express API server (Node.js + TypeScript)

## Prerequisites

- Node.js (v18 or higher recommended)
- npm

## Setup Instructions

### 1. Install Frontend Dependencies

From the root directory:

```bash
npm install
```

### 2. Setup Backend Server

Navigate to the server directory:

```bash
cd server
npm install
```

### 3. Configure Environment Variables

Copy the example environment file in the server directory:

```bash
cp .env.example .env
```

The `.env` file contains:
- `PORT=3001` - Server port (default: 3001)
- `CLIENT_URL=http://localhost:5173` - Vite dev server URL for CORS configuration

You can modify these values if needed.

## Running the Application

### Development Mode

You'll need to run both the frontend and backend servers simultaneously.

**Terminal 1 - Frontend (from root directory):**
```bash
npm run dev
```
The Vite dev server will start on `http://localhost:5173` (or the next available port).

**Terminal 2 - Backend (from server directory):**
```bash
cd server
npm run dev
```
The Express server will start on `http://localhost:3001` (or the port specified in `.env`).

### Production Mode

**Build the frontend:**
```bash
npm run build
```

**Build and start the backend:**
```bash
cd server
npm run build
npm start
```

## API Endpoints

### POST `/api/review`

Submit a ticket for QA review.

**Request Body:**
```json
{
  "inputFormat": "text" | "json",
  "ticketText": "string"
}
```

**Response:**
```json
{
  "criteria": {
    "Criterion Name": {
      "score": 4,
      "notes": "Feedback notes..."
    }
  },
  "coaching_summary": "Overall coaching summary..."
}
```

**Validation:**
- Returns `400` if `ticketText` is missing or empty

## Notes

- The backend currently returns mocked responses. Replace the mock data in `server/src/routes/review.ts` with your actual review logic when ready.
- CORS is configured to allow requests from the Vite dev server. Update `CLIENT_URL` in `.env` if using a different frontend URL.
