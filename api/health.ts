import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development',
    services: {
      gemini: !!process.env.GEMINI_API_KEY,
      telegram: !!process.env.BOT_TOKEN,
      webhook: true
    }
  };

  res.status(200).json(health);
} 