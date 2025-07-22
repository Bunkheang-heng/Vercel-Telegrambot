import { Telegraf } from 'telegraf';
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const bot = new Telegraf(process.env.BOT_TOKEN!);
    const webhookUrl = `${process.env.VERCEL_URL || req.headers.host}/api/webhook`;
    const fullWebhookUrl = webhookUrl.startsWith('http') ? webhookUrl : `https://${webhookUrl}`;

    await bot.telegram.setWebhook(fullWebhookUrl);
    
    res.status(200).json({ 
      success: true, 
      message: 'Webhook set successfully',
      webhookUrl: fullWebhookUrl
    });
  } catch (error) {
    console.error('Error setting webhook:', error);
    res.status(500).json({ 
      error: 'Failed to set webhook',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 