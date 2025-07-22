// DEPRECATED: This file is for local development with polling.
// For Vercel deployment, use api/webhook.ts instead.

import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

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

// Launch the bot
bot.launch();
console.log('🤖 Telegram bot is running...');
