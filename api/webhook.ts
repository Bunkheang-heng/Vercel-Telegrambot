import { Telegraf } from 'telegraf';
import { VercelRequest, VercelResponse } from '@vercel/node';

const bot = new Telegraf(process.env.BOT_TOKEN!);

// Start command
bot.start((ctx) => ctx.reply('👋 Hello! Welcome to my Telegram bot.'));

// Help command
bot.help((ctx) =>
  ctx.reply('🤖 Available commands:\n/start - Start the bot\n/help - Show help\n/echo - Echo your message')
);

// Echo command
bot.command('echo', (ctx) => {
  const input = ctx.message.text.split(' ').slice(1).join(' ');
  ctx.reply(`🪞 You said: ${input || 'nothing 🤔'}`);
});

// Handle plain text messages
bot.on('text', (ctx) => {
  ctx.reply(`📝 You sent: "${ctx.message.text}"`);
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'POST') {
      await bot.handleUpdate(req.body);
      res.status(200).json({ ok: true });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling update:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 