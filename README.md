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

**Backend Environment Variables:**

Copy the example environment file in the server directory:

```bash
cd server
cp .env.example .env
```

Edit `server/.env` and set your OpenAI API key:

```bash
OPENAI_API_KEY=your_actual_openai_api_key_here
```

The `.env` file can also contain:
- `PORT=3001` - Server port (default: 3001)
- `CLIENT_URL=http://localhost:5173` - Vite dev server URL for CORS configuration
- `NODE_ENV=development` - Node environment (default: development)

**Frontend Environment Variables (Optional):**

If you need to point the frontend to a different backend URL, create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and set:

```bash
VITE_API_URL=http://localhost:3001
```

**Note:** The frontend defaults to `http://localhost:3001` if `VITE_API_URL` is not set, so this step is optional for local development.

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

## Deployment

### Deploying to Render.com

This application is configured for easy deployment on [Render.com](https://render.com). The project includes a `render.yaml` file that automates the deployment setup.

#### Prerequisites

1. A Render.com account (free tier available)
2. Your repository pushed to GitHub
3. An OpenAI API key

#### Deployment Steps

1. **Connect Repository to Render:**
   - Log in to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" and select "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file

2. **Configure Environment Variables:**

   After Render creates the services, you'll need to set environment variables:

   **Backend Service (`qa-coaching-agent-api`):**
   - Go to the backend service settings
   - Add environment variables:
     - `OPENAI_API_KEY` - Your OpenAI API key (required)
     - `CLIENT_URL` - Your frontend Render URL (e.g., `https://qa-coaching-agent-frontend.onrender.com`)
     - `NODE_ENV` - Set to `production` (optional, Render may set this automatically)

   **Frontend Service (`qa-coaching-agent-frontend`):**
   - Go to the frontend service settings
   - Add environment variables:
     - `VITE_API_URL` - Your backend Render URL (e.g., `https://qa-coaching-agent-api.onrender.com`)

3. **Deploy:**
   - Render will automatically deploy both services
   - Wait for both deployments to complete
   - Your application will be live at the frontend URL

#### Important Notes

- **Service URLs:** After deployment, update the `CLIENT_URL` in the backend service with your frontend URL, and `VITE_API_URL` in the frontend service with your backend URL.
- **Free Tier Limitations:** Render's free tier spins down services after 15 minutes of inactivity. The first request after spin-down may take longer.
- **Environment Variables:** Never commit `.env` files to your repository. Use Render's environment variable settings in the dashboard.

#### Manual Deployment (Alternative)

If you prefer to deploy services manually:

**Backend (Web Service):**
- Type: Web Service
- Root Directory: `server`
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Environment: Node

**Frontend (Static Site):**
- Type: Static Site
- Root Directory: `.` (root)
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Environment: Static

## Notes

- CORS is configured to allow requests from both local development (localhost) and production URLs.
- The backend uses OpenAI's API for generating QA reviews. Ensure your API key is properly configured.
- Local development workflow remains unchanged after deployment configuration.
