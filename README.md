# 🤖 Kheang Bot - Professional AI Assistant

A sophisticated Telegram bot that serves as a personal AI assistant for Heng Bunkheang (Kheang). Built with a modular architecture, rate limiting, caching, and comprehensive monitoring.

## ✨ Features

### 🎯 **Core Functionality**
- **Personal AI Assistant**: Answers questions about Kheang's background, experience, projects, and skills
- **Strict Topic Control**: Only responds to questions about Kheang, redirects off-topic questions
- **Professional Formatting**: Clean HTML formatting with bold project names and proper links
- **Animated Loading**: Shows loading indicators while processing requests
- **Interactive Buttons**: Quick access buttons for common questions
- **Input Validation**: Sanitizes and validates user inputs for security
- **Queue System**: Handles multiple concurrent users efficiently
- **Analytics**: Tracks usage patterns and performance metrics

### 🏗️ **Technical Features**
- **Modular Architecture**: Clean separation of concerns with dedicated services
- **Rate Limiting**: 10 requests/minute, 100 requests/hour per user
- **Smart Caching**: 5-minute cache for repeated questions
- **Error Handling**: Comprehensive error recovery and user feedback
- **Activity Logging**: Full monitoring and analytics
- **Session Management**: User conversation tracking
- **Queue Management**: Priority-based request queuing for scalability
- **Input Sanitization**: Security-first approach to user inputs
- **Performance Monitoring**: Real-time analytics and metrics
- **Health Checks**: System status monitoring and diagnostics

### 🚀 **Performance**
- **Fast Responses**: Optimized AI model (gemini-1.5-flash-8b)
- **Scalable**: Handles multiple concurrent users with queue system
- **Memory Efficient**: Automatic cleanup of old data
- **Production Ready**: Enterprise-grade architecture
- **Concurrent Processing**: Up to 3 simultaneous requests
- **Smart Caching**: Reduces API calls and improves response times
- **Priority Queuing**: Important requests get processed first

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

#### **QueueService**
- Priority-based request queuing
- Concurrent processing (up to 3 simultaneous requests)
- Request timeout handling
- Queue monitoring and management

#### **AnalyticsService**
- Real-time usage tracking
- Performance metrics
- Popular questions analysis
- Error rate monitoring

#### **InputValidator**
- Message validation and sanitization
- Security threat detection
- Question categorization
- User input safety

#### **KeyboardHandler**
- Interactive button management
- Quick access to common information
- Professional response formatting
- Enhanced user experience

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
- `/start` - Welcome message with interactive buttons
- `/help` - Detailed help information with quick access buttons

### **Interactive Features**
- **Quick Access Buttons**: Click buttons for instant access to:
  - 📋 Projects
  - 🎓 Education  
  - 🏆 Awards
  - 💼 Experience
  - 🛠️ Skills
  - 📞 Contact
  - 🤝 Volunteer
  - ❓ Help

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
• <b>QuickResume</b>: Web app to generate professional resumes using Next.js and Firebase with AI-assisted templates. (<a href='https://quick-resume-af9c.vercel.app/'>View Project</a>)
• <b>STEMii</b>: STEM learning platform with AI-based self-assessment tools using ReactJS, NodeJS, and Firebase. (<a href='https://stemii1.web.app/'>View Project</a>)
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
- **Input Validation**: Sanitizes user inputs and prevents malicious content
- **Error Recovery**: Graceful handling of API failures
- **Memory Management**: Automatic cleanup prevents memory leaks
- **Timeout Handling**: Prevents hanging requests
- **Queue Management**: Prevents system overload with priority-based queuing
- **Security Scanning**: Detects and blocks malicious input patterns
- **Request Sanitization**: Removes HTML tags and dangerous content

## 📈 Scalability

- **Concurrent Users**: Supports hundreds of simultaneous users with queue system
- **Caching**: Reduces API calls and improves response times
- **Modular Design**: Easy to add new features or modify existing ones
- **Monitoring**: Real-time insights into bot performance
- **Queue Processing**: Handles up to 3 concurrent requests with priority queuing
- **Analytics**: Tracks usage patterns for optimization
- **Health Monitoring**: Continuous system status checks

## 🐛 Troubleshooting

### **Common Issues**

1. **Bot not responding**
   - Check if webhook is properly set up
   - Verify environment variables in Vercel dashboard
   - Check bot logs for errors
   - Test health endpoint: `/api/health`

2. **Rate limit exceeded**
   - Wait for the rate limit period to reset
   - Check your usage patterns
   - Use interactive buttons for faster access

3. **AI responses slow**
   - Check Gemini API quota
   - Verify network connectivity
   - Monitor response times in logs
   - Check queue status and concurrent users

4. **Input validation errors**
   - Ensure messages are under 1000 characters
   - Avoid special characters or HTML tags
   - Check for malicious content patterns

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