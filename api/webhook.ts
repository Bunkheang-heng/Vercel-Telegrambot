import { Telegraf } from 'telegraf';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import { InputValidator } from '../src/utils/inputValidator';
import { KeyboardHandler } from '../src/utils/keyboardHandler';

// Load personal information
const personalInfo = JSON.parse(fs.readFileSync(process.cwd() + '/info.json', 'utf8'));

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

// Check environment variables
if (!process.env.BOT_TOKEN) {
  console.error('BOT_TOKEN environment variable is not set');
}
if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY environment variable is not set');
}

// Initialize services (will be initialized in handler)
let queueService: any;
let analyticsService: any;

const bot = new Telegraf(process.env.BOT_TOKEN!);

// Helper function for animated loading
async function sendResponseWithAnimatedLoading(ctx: any, response: string): Promise<void> {
  // Send initial loading message
  const loadingMsg = await ctx.reply('🤔 <b>Kheang Bot is thinking...</b>', { parse_mode: 'HTML' });
  
  // Show typing indicator
  await ctx.sendChatAction('typing');
  
  // Simulate thinking time based on response length
  const thinkingTime = Math.min(2000, response.length * 15);
  await new Promise(resolve => setTimeout(resolve, thinkingTime));
  
  // Delete loading message
  try {
    await ctx.deleteMessage(loadingMsg.message_id);
  } catch (error) {
    // Ignore if message can't be deleted
  }
  
  // Send the actual response with HTML parsing
  if (response.length > CONFIG.MAX_RESPONSE_LENGTH) {
    const chunks = response.match(new RegExp(`.{1,${CONFIG.CHUNK_SIZE}}`, 'g')) || [response];
    for (const chunk of chunks) {
      await ctx.reply(chunk, { parse_mode: 'HTML' });
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  } else {
    ctx.reply(response, { parse_mode: 'HTML' });
  }
}

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

💡 Use the buttons below or just send me any message!

📊 Rate limits: ${CONFIG.MAX_REQUESTS_PER_MINUTE}/min, ${CONFIG.MAX_REQUESTS_PER_HOUR}/hour`;

  ctx.reply(welcomeMessage, { reply_markup: KeyboardHandler.getMainKeyboard() });
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

💬 Usage: Use the buttons below or simply send me any message!

⚡ Rate Limits: ${CONFIG.MAX_REQUESTS_PER_MINUTE} requests/minute, ${CONFIG.MAX_REQUESTS_PER_HOUR}/hour

🔄 If I'm slow, try a shorter question or wait a moment.

Need help? Contact: bunkheangheng99@gmail.com`;

  ctx.reply(helpMessage, { reply_markup: KeyboardHandler.getMainKeyboard() });
});

// Handle all text messages with AI (Professional Kheang Bot)
bot.on('text', async (ctx) => {
  const userId = ctx.from?.id?.toString() || 'unknown';
  const message = ctx.message.text;
  const startTime = Date.now();

  try {
    // Input validation
    const validation = InputValidator.validateMessage(message);
    if (!validation.isValid) {
      ctx.reply(`❌ ${validation.error}`);
      return;
    }

    const sanitizedMessage = InputValidator.sanitizeMessage(message);
    const questionCategory = InputValidator.categorizeQuestion(sanitizedMessage);

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

    // Check cache first
    const cachedResponse = rateLimiter.getCachedResponse(sanitizedMessage);
    if (cachedResponse) {
      await sendResponseWithAnimatedLoading(ctx, cachedResponse);
      return;
    }

    // Send initial loading message
    const loadingMsg = await ctx.reply('🤔 <b>Kheang Bot is thinking...</b>', { parse_mode: 'HTML' });
    
    // Show typing indicator
    await ctx.sendChatAction('typing');

    // Generate AI response
    console.log('Starting AI generation for message:', sanitizedMessage);
    console.log('Gemini API Key exists:', !!process.env.GEMINI_API_KEY);
    
    const context = `You are Kheang Bot, a professional AI assistant for Heng Bunkheang (Kheang).

Kheang's Information:
${JSON.stringify(personalInfo, null, 2)}

STRICT INSTRUCTIONS:
- ONLY answer questions about Kheang (Heng Bunkheang)
- If asked about ANYTHING else (math, weather, general knowledge, other people, etc.), respond with:
  "I'm Kheang Bot, designed specifically to help you learn about Heng Bunkheang (Kheang). I can tell you about his background, experience, projects, skills, awards, and more. What would you like to know about Kheang?"
- Do NOT answer questions about:
  • Mathematics or calculations
  • Weather or current events
  • General knowledge questions
  • Other people or celebrities
  • Technical problems unrelated to Kheang
  • Any topic not directly about Kheang
- When mentioning Kheang's projects, use proper formatting:
  • Use bullet points (•) for lists
  • Use Telegram bold formatting with <b> tags for project names
  • Include project links when available using HTML anchor tags
  • Format: "• <b>Project Name</b>: description (<a href='link'>View Project</a>)"
  • Never use markdown ** or * symbols
  • Always include the actual project links from the data when available

User Question: ${sanitizedMessage}`;

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), CONFIG.TIMEOUT)
    );

    console.log('Making API call to Gemini...');
    const apiCall = model.generateContent(context);
    const result = await Promise.race([apiCall, timeoutPromise]) as any;
    console.log('API call completed successfully');
    const response = await result.response;
    const text = response.text() || 'I apologize, but I couldn\'t generate a response. Please try again.';
    console.log('Generated response:', text.substring(0, 100) + '...');
    
    // Cache the response
    rateLimiter.cacheResponse(sanitizedMessage, text);
    
    // Delete loading message and send response
    try {
      await ctx.deleteMessage(loadingMsg.message_id);
    } catch (error) {
      // Ignore if message can't be deleted
    }
    
    // Send response with HTML parsing
    if (text.length > CONFIG.MAX_RESPONSE_LENGTH) {
      const chunks = text.match(new RegExp(`.{1,${CONFIG.CHUNK_SIZE}}`, 'g')) || [text];
      for (const chunk of chunks) {
        await ctx.reply(chunk, { parse_mode: 'HTML' });
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } else {
      ctx.reply(text, { parse_mode: 'HTML' });
    }
    
  } catch (error) {
    console.error('Gemini AI error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    
    if ((error as Error).message === 'Request timeout') {
      ctx.reply('⏰ The AI is taking too long to respond. Please try a shorter question or wait a moment.');
    } else if ((error as Error).message.includes('quota')) {
      ctx.reply('🚫 Service temporarily unavailable due to high demand. Please try again in a few minutes.');
    } else if ((error as Error).message.includes('API_KEY')) {
      ctx.reply('🔑 API configuration error. Please contact support.');
    } else {
      ctx.reply('❌ An error occurred while processing your request. Please try again.');
    }
  }
});

// Handle button callbacks
bot.action(/.*/, async (ctx) => {
  const userId = ctx.from?.id?.toString() || 'unknown';
  const callbackData = ctx.match[0];
  const startTime = Date.now();

  try {
    const response = await KeyboardHandler.handleCallback(callbackData);
    await ctx.reply(response, { parse_mode: 'HTML', reply_markup: KeyboardHandler.getMainKeyboard() });
  } catch (error) {
    console.error('Button callback error:', error);
    ctx.reply('❌ An error occurred while processing your request. Please try again.');
  }
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Initialize services if not already done
    if (!queueService) {
      const { QueueService } = await import('../src/services/queueService');
      queueService = new QueueService();
    }
    if (!analyticsService) {
      const { AnalyticsService } = await import('../src/services/analyticsService');
      analyticsService = new AnalyticsService();
    }

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