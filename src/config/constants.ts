// Professional Kheang Bot Configuration
export const CONFIG = {
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

export const MESSAGES = {
  WELCOME: `👋 Welcome to Kheang Bot!

I'm your AI assistant for everything about Heng Bunkheang (Kheang). 

🔍 I can help you learn about:
• Kheang's background & education
• Work experience & projects  
• Skills & technologies
• Awards & competitions
• Volunteer work
• Contact information

💡 Just send me any message and I'll help you discover more about Kheang!

📊 Rate limits: ${CONFIG.MAX_REQUESTS_PER_MINUTE}/min, ${CONFIG.MAX_REQUESTS_PER_HOUR}/hour`,

  HELP: `🤖 Kheang Bot Help

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

Need help? Contact: bunkheangheng99@gmail.com`,

  RATE_LIMIT: `⏰ Rate limit exceeded!

You've used all your requests for this period.
• Minute limit: ${CONFIG.MAX_REQUESTS_PER_MINUTE}/min
• Hour limit: ${CONFIG.MAX_REQUESTS_PER_HOUR}/hour

Please wait a moment before trying again.`,

  TIMEOUT: '⏰ The AI is taking too long to respond. Please try a shorter question or wait a moment.',
  QUOTA_ERROR: '🚫 Service temporarily unavailable due to high demand. Please try again in a few minutes.',
  GENERAL_ERROR: '❌ An error occurred while processing your request. Please try again.',
  UNEXPECTED_ERROR: '❌ An unexpected error occurred. Please try again later.',
  NO_RESPONSE: 'I apologize, but I couldn\'t generate a response. Please try again.',
}; 