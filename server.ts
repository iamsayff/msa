import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

// Authorized domains for CORS and OAuth headers
const ALLOWED_ORIGINS = [
  'https://amusuelections.in',
  'https://www.amusuelections.in',
  'http://localhost:3000',
  'http://localhost:5173',
];

// Admin accounts authorized for election administration
const AUTHORIZED_ADMIN_EMAILS = [
  'talktoaamirsaif@gmail.com',
  'ansaarsaif7@gmail.com',
];

app.use(express.json());

// Set Security & CORS Headers for amusuelections.in and Google Auth popup support
app.use((req: Request, res: Response, next) => {
  const origin = req.headers.origin;
  if (origin && (ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.run.app') || origin.endsWith('.firebaseapp.com'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!isProd) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // CRITICAL for Firebase & Google OAuth popup window interaction:
  // same-origin-allow-popups allows signInWithPopup to exchange credentials back to the main window
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    domain: 'amusuelections.in',
    timestamp: new Date().toISOString(),
    environment: isProd ? 'production' : 'development',
  });
});

// Auth & Domain configuration endpoint for frontend verification
app.get('/api/auth-config', (_req: Request, res: Response) => {
  res.json({
    primaryDomain: 'amusuelections.in',
    authorizedOrigins: ALLOWED_ORIGINS,
    firebaseAuthDomain: 'gen-lang-client-0453401300.firebaseapp.com',
    corsConfigured: true,
  });
});

// Admin authorization verification endpoint
app.post('/api/verify-admin', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || typeof email !== 'string') {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();
  const isAuthorized = AUTHORIZED_ADMIN_EMAILS.includes(normalizedEmail);

  res.json({
    authorized: isAuthorized,
  });
});

// Serve frontend in production or mount Vite middleware in development
async function startServer() {
  if (!isProd) {
    // In development mode, dynamically import Vite and mount dev middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve the built static assets from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));

    // Handle client-side routing fallback (SPA)
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AMUSU Elections Server] Running on http://0.0.0.0:${PORT} for domain amusuelections.in (${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
