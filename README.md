# 🤖 Kheang Bot - Professional AI Assistant

A sophisticated Telegram bot that serves as a personal AI assistant for Heng Bunkheang (Kheang). Built with a modular architecture, rate limiting, caching, and comprehensive monitoring.

## ✨ Features

### 🎯 **Core Functionality**
- **Personal AI Assistant**: Answers questions about Kheang's background, experience, projects, and skills
- **Strict Topic Control**: Only responds to questions about Kheang, redirects off-topic questions
- **Professional Formatting**: Clean HTML formatting with bold project names and proper links
- **Animated Loading**: Shows loading indicators while processing requests

### 🏗️ **Technical Features**
- **Modular Architecture**: Clean separation of concerns with dedicated services
- **Rate Limiting**: 10 requests/minute, 100 requests/hour per user
- **Smart Caching**: 5-minute cache for repeated questions
- **Error Handling**: Comprehensive error recovery and user feedback
- **Activity Logging**: Full monitoring and analytics
- **Session Management**: User conversation tracking

### 🚀 **Performance**
- **Fast Responses**: Optimized AI model (gemini-1.5-flash-8b)
- **Scalable**: Handles multiple concurrent users
- **Memory Efficient**: Automatic cleanup of old data
- **Production Ready**: Enterprise-grade architecture

## 🛠️ Setup

### 1. Prerequisites

- [Telegram Bot Token](https://core.telegram.org/bots#6-botfather) from BotFather
- [Google Gemini API Key](https://aistudio.google.com/app/apikey)
- Node.js and npm installed locally

### 2. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd telegrambot

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

### 3. Configuration

Edit `.env` file and add your credentials:

```env
BOT_TOKEN=your_telegram_bot_token_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Local Development

```bash
# Start the modular bot
npm start

# Start the old monolithic bot (for comparison)
npm run start:old
```

## 🏗️ Architecture

### **Modular Structure**
```
src/
├── config/
│   └── constants.ts          # Configuration and messages
├── services/
│   ├── rateLimiter.ts        # Rate limiting and caching
│   ├── aiService.ts          # AI/ML functionality
│   └── logger.ts             # Logging and monitoring
├── utils/
│   └── responseHandler.ts    # Response formatting utilities
├── data/
│   └── personalInfo.ts       # Personal data management
├── bot/
│   └── KheangBot.ts          # Main bot orchestration
└── index.ts                  # Entry point
```

### **Key Services**

#### **RateLimiter**
- User request tracking with minute/hourly limits
- Smart caching with TTL
- Automatic cleanup of old data

#### **AIService**
- Google Gemini AI integration
- User session management
- Context-aware responses

#### **Logger**
- Activity tracking and analytics
- Error monitoring
- Performance metrics

#### **PersonalInfoService**
- Singleton pattern for data access
- Type-safe data retrieval
- Helper methods for specific information

## 🚀 Deployment

### **Vercel Deployment**

```bash
# Deploy to Vercel
npm run deploy
```

### **Environment Variables (Vercel)**
- `BOT_TOKEN`: Your Telegram bot token
- `GEMINI_API_KEY`: Your Google Gemini API key

### **Webhook Setup**
After deployment, set up the webhook:
```bash
curl -X POST https://your-vercel-domain.vercel.app/api/set-webhook
```

## 📊 Monitoring

The bot includes comprehensive monitoring:

- **Activity Logs**: User interactions and bot responses
- **Error Tracking**: Detailed error logging with context
- **Performance Metrics**: Response times and cache hit rates
- **Rate Limit Statistics**: Usage patterns and limits

### **Log Format**
```json
{
  "timestamp": "2025-08-03T11:19:43.111Z",
  "userId": "1099911298",
  "action": "message_received",
  "details": "user message",
  "userAgent": "KheangBot/1.0",
  "level": "info"
}
```

## 🎯 Usage

### **Bot Commands**
- `/start` - Welcome message with bot capabilities
- `/help` - Detailed help information

### **Example Interactions**

**✅ On-topic questions:**
- "Tell me about Kheang's projects"
- "What are Kheang's skills?"
- "Where does Kheang work?"
- "What awards has Kheang won?"

**❌ Off-topic questions (redirected):**
- "What is 9+10?" → Redirected to ask about Kheang
- "What's the weather?" → Redirected to ask about Kheang
- "Tell me a joke" → Redirected to ask about Kheang

### **Response Format**
```
• <b>QuickResume</b>: Web app to generate professional resumes using Next.js and Firebase with AI-assisted templates. (https://quick-resume-af9c.vercel.app/)
• <b>STEMii</b>: STEM learning platform with AI-based self-assessment tools using ReactJS, NodeJS, and Firebase. (https://stemii1.web.app/)
```

## 🔧 Configuration

### **Rate Limits**
```typescript
MAX_REQUESTS_PER_MINUTE: 10
MAX_REQUESTS_PER_HOUR: 100
CACHE_TTL: 300000 // 5 minutes
TIMEOUT: 12000 // 12 seconds
```

### **AI Model Settings**
```typescript
MODEL: 'gemini-1.5-flash-8b'
MAX_TOKENS: 800
TEMPERATURE: 0.7
```

## 🛡️ Security & Performance

- **Rate Limiting**: Prevents abuse and controls costs
- **Input Validation**: Sanitizes user inputs
- **Error Recovery**: Graceful handling of API failures
- **Memory Management**: Automatic cleanup prevents memory leaks
- **Timeout Handling**: Prevents hanging requests

## 📈 Scalability

- **Concurrent Users**: Supports hundreds of simultaneous users
- **Caching**: Reduces API calls and improves response times
- **Modular Design**: Easy to add new features or modify existing ones
- **Monitoring**: Real-time insights into bot performance

## 🐛 Troubleshooting

### **Common Issues**

1. **Bot not responding**
   - Check if webhook is properly set up
   - Verify environment variables in Vercel dashboard
   - Check bot logs for errors

2. **Rate limit exceeded**
   - Wait for the rate limit period to reset
   - Check your usage patterns

3. **AI responses slow**
   - Check Gemini API quota
   - Verify network connectivity
   - Monitor response times in logs

### **Debug Mode**
Enable detailed logging by checking the console output for activity logs.

## 🤝 Contributing

This bot is designed specifically for Heng Bunkheang. For modifications:

1. Update `info.json` with new personal information
2. Modify AI prompts in `src/services/aiService.ts`
3. Adjust rate limits in `src/config/constants.ts`
4. Test thoroughly before deployment

## 📄 License

ISC

---

**Built with ❤️ for Kheang's professional brand** 