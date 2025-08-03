# Kheang Bot - Modular Architecture

## 📁 Project Structure

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

## 🏗️ Architecture Overview

### **Separation of Concerns**
- **Config**: Centralized configuration and messages
- **Services**: Core business logic (AI, rate limiting, logging)
- **Utils**: Helper functions and utilities
- **Data**: Data access and management
- **Bot**: Main bot orchestration and Telegram integration

### **Key Benefits**
1. **Maintainability**: Each module has a single responsibility
2. **Testability**: Services can be tested independently
3. **Scalability**: Easy to add new features or modify existing ones
4. **Reusability**: Services can be reused across different parts
5. **Type Safety**: Full TypeScript support with interfaces

## 🔧 Services

### **RateLimiter**
- User request tracking
- Cache management
- Automatic cleanup

### **AIService**
- Gemini AI integration
- User session management
- Response generation

### **Logger**
- Activity tracking
- Error monitoring
- Performance metrics

### **PersonalInfoService**
- Singleton pattern for data access
- Type-safe data retrieval
- Helper methods for specific data

## 🚀 Usage

```bash
# Run the modular bot
npm start

# Run the old monolithic bot (for comparison)
npm run start:old
```

## 📊 Monitoring

The bot includes comprehensive monitoring:
- User activity logs
- Error tracking
- Performance metrics
- Rate limit statistics

## 🔄 Migration

The old `bot.ts` file is preserved as `start:old` for comparison. The new modular structure provides the same functionality with better organization. 