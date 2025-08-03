import { Telegraf } from 'telegraf';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';

// Load personal information
const personalInfo = JSON.parse(fs.readFileSync('./info.json', 'utf8'));

// Professional configuration
const CONFIG = {
  MAX_REQUESTS_PER_MINUTE: 10,
  MAX_REQUESTS_PER_HOUR: 100,
  CACHE_TTL: 300000, // 5 minutes
  TIMEOUT: 12000, // 12 seconds
  MAX_RESPONSE_LENGTH: 4096,
  CHUNK_SIZE: 4000,
  MODEL: 'gemini-1.5-flash-8b',
  MAX_TOKENS: 800,
  TEMPERATURE: 0.7,
};

// Rate limiting and caching (in-memory for serverless)
const rateLimiter = {
  requests: new Map<string, number[]>(),
  cache: new Map<string, { response: string; timestamp: number }>(),

  isRateLimited(userId: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(userId) || [];
    
    const recentRequests = userRequests.filter(time => now - time < 60000);
    const hourlyRequests = userRequests.filter(time => now - time < 3600000);
    
    this.requests.set(userId, [...recentRequests, now]);
    
    return recentRequests.length >= CONFIG.MAX_REQUESTS_PER_MINUTE || 
           hourlyRequests.length >= CONFIG.MAX_REQUESTS_PER_HOUR;
  },

  getCachedResponse(prompt: string): string | null {
    const cached = this.cache.get(prompt);
    if (cached && Date.now() - cached.timestamp < CONFIG.CACHE_TTL) {
      return cached.response;
    }
    return null;
  },

  cacheResponse(prompt: string, response: string): void {
    this.cache.set(prompt, { response, timestamp: Date.now() });
  }
};

const bot = new Telegraf(process.env.BOT_TOKEN!);

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: CONFIG.MODEL,
  generationConfig: {
    maxOutputTokens: CONFIG.MAX_TOKENS,
    temperature: CONFIG.TEMPERATURE,
  }
});

// Start command with professional welcome
bot.start((ctx) => {
  const welcomeMessage = `👋 Welcome to Kheang Bot!

I'm your AI assistant for everything about Heng Bunkheang (Kheang). 

🔍 I can help you learn about:
• Kheang's background & education
• Work experience & projects  
• Skills & technologies
• Awards & competitions
• Volunteer work
• Contact information

💡 Just send me any message and I'll help you discover more about Kheang!

📊 Rate limits: ${CONFIG.MAX_REQUESTS_PER_MINUTE}/min, ${CONFIG.MAX_REQUESTS_PER_HOUR}/hour`;

  ctx.reply(welcomeMessage);
});

// Help command
bot.help((ctx) => {
  const helpMessage = `🤖 Kheang Bot Help

I'm here to answer questions about Heng Bunkheang (Kheang).

📋 What I can tell you about:
• Background & Education
• Work Experience & Projects  
• Skills & Technologies
• Awards & Competitions
• Volunteer Work
• Contact Information

💬 Usage: Simply send me any message!

⚡ Rate Limits: ${CONFIG.MAX_REQUESTS_PER_MINUTE} requests/minute, ${CONFIG.MAX_REQUESTS_PER_HOUR}/hour

🔄 If I'm slow, try a shorter question or wait a moment.

Need help? Contact: bunkheangheng99@gmail.com`;

  ctx.reply(helpMessage);
});

// Handle all text messages with AI (Professional Kheang Bot)
bot.on('text', async (ctx) => {
  const userId = ctx.from?.id?.toString() || 'unknown';
  const message = ctx.message.text;

  try {
    // Check rate limiting
    if (rateLimiter.isRateLimited(userId)) {
      const rateLimitMessage = `⏰ Rate limit exceeded!

You've used all your requests for this period.
• Minute limit: ${CONFIG.MAX_REQUESTS_PER_MINUTE}/min
• Hour limit: ${CONFIG.MAX_REQUESTS_PER_HOUR}/hour

Please wait a moment before trying again.`;

      ctx.reply(rateLimitMessage);
      return;
    }

    // Show typing indicator
    await ctx.sendChatAction('typing');

    // Check cache first
    const cachedResponse = rateLimiter.getCachedResponse(message);
    if (cachedResponse) {
      ctx.reply(cachedResponse);
      return;
    }

    // Generate AI response
    const context = `You are Kheang Bot, a professional AI assistant for Heng Bunkheang (Kheang).

Kheang's Information:
${JSON.stringify(personalInfo, null, 2)}

Instructions:
- Answer questions about Kheang professionally and accurately
- Be friendly but maintain professional tone
- If asked about something not related to Kheang, politely redirect
- Keep responses concise but informative

User Question: ${message}`;

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), CONFIG.TIMEOUT)
    );

    const apiCall = model.generateContent(context);
    const result = await Promise.race([apiCall, timeoutPromise]) as any;
    const response = await result.response;
    const text = response.text() || 'I apologize, but I couldn\'t generate a response. Please try again.';
    
    // Cache the response
    rateLimiter.cacheResponse(message, text);
    
    // Handle long responses by chunking
    if (text.length > CONFIG.MAX_RESPONSE_LENGTH) {
      const chunks = text.match(new RegExp(`.{1,${CONFIG.CHUNK_SIZE}}`, 'g')) || [text];
      for (const chunk of chunks) {
        await ctx.reply(chunk);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } else {
      ctx.reply(text);
    }
    
  } catch (error) {
    console.error('Gemini AI error:', error);
    if ((error as Error).message === 'Request timeout') {
      ctx.reply('⏰ The AI is taking too long to respond. Please try a shorter question or wait a moment.');
    } else if ((error as Error).message.includes('quota')) {
      ctx.reply('🚫 Service temporarily unavailable due to high demand. Please try again in a few minutes.');
    } else {
      ctx.reply('❌ An error occurred while processing your request. Please try again.');
    }
  }
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