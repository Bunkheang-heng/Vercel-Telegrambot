import { Telegraf } from 'telegraf';
import { CONFIG, MESSAGES } from '../config/constants';
import { RateLimiter } from '../services/rateLimiter';
import { AIService } from '../services/aiService';
import { Logger } from '../services/logger';
import { ResponseHandler } from '../utils/responseHandler';
import { PersonalInfoService } from '../data/personalInfo';

export class KheangBot {
  private bot: Telegraf;
  private rateLimiter: RateLimiter;
  private aiService: AIService;
  private logger: Logger;
  private personalInfoService: PersonalInfoService;

  constructor() {
    this.bot = new Telegraf(process.env.BOT_TOKEN!);
    this.rateLimiter = new RateLimiter();
    this.aiService = new AIService();
    this.logger = new Logger();
    this.personalInfoService = PersonalInfoService.getInstance();
    
    this.setupBot();
    this.setupCleanup();
  }

  private setupBot(): void {
    // Start command
    this.bot.start((ctx) => {
      ctx.reply(MESSAGES.WELCOME);
      this.logger.log(ctx.from?.id?.toString() || 'unknown', 'start_command');
    });

    // Help command
    this.bot.help((ctx) => {
      ctx.reply(MESSAGES.HELP);
      this.logger.log(ctx.from?.id?.toString() || 'unknown', 'help_command');
    });

    // Handle all text messages
    this.bot.on('text', async (ctx) => {
      await this.handleMessage(ctx);
    });

    // Error handling
    this.bot.catch((err, ctx) => {
      console.error('Bot error:', err);
      ctx.reply(MESSAGES.UNEXPECTED_ERROR);
      this.logger.error(ctx.from?.id?.toString() || 'unknown', 'error', (err as Error).message);
    });
  }

  private async handleMessage(ctx: any): Promise<void> {
    const userId = ctx.from?.id?.toString() || 'unknown';
    const message = ctx.message.text;

    try {
      // Log incoming message
      this.logger.log(userId, 'message_received', message);

      // Check rate limiting
      if (this.rateLimiter.isRateLimited(userId)) {
        const remaining = this.rateLimiter.getRemainingRequests(userId);
        const rateLimitMessage = ResponseHandler.formatRateLimitMessage(remaining);
        
        ctx.reply(rateLimitMessage);
        this.logger.warn(userId, 'rate_limited');
        return;
      }

      // Check cache first
      const cachedResponse = this.rateLimiter.getCachedResponse(message);
      if (cachedResponse) {
        await ResponseHandler.sendResponseWithAnimatedLoading(ctx, cachedResponse);
        this.logger.log(userId, 'cache_hit');
        return;
      }

      // Generate AI response
      const personalInfo = this.personalInfoService.getPersonalInfo();
      const response = await this.aiService.generateResponse(message, userId, personalInfo);
      
      // Cache the response
      this.rateLimiter.cacheResponse(message, response);
      
      // Send response with animated loading
      await ResponseHandler.sendResponseWithAnimatedLoading(ctx, response);
      
      this.logger.log(userId, 'response_sent', response.substring(0, 100));

    } catch (error) {
      console.error('Message handling error:', error);
      await ResponseHandler.handleError(ctx, error, this.logger);
    }
  }

  private setupCleanup(): void {
    // Clean up old data every 30 minutes
    setInterval(() => {
      this.rateLimiter.cleanup();
      this.aiService.cleanupOldSessions();
      this.logger.cleanup();
    }, 30 * 60 * 1000);
  }

  public launch(): void {
    this.bot.launch();
    console.log('🚀 Professional Kheang Bot is running...');
    console.log(`📊 Configuration: ${CONFIG.MAX_REQUESTS_PER_MINUTE}/min, ${CONFIG.MAX_REQUESTS_PER_HOUR}/hour rate limits`);
    console.log(`⚡ Model: ${CONFIG.MODEL}, Timeout: ${CONFIG.TIMEOUT}ms`);
    
    // Graceful shutdown
    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
  }

  // Public methods for monitoring
  public getStats() {
    return {
      logger: this.logger.getStats(),
      // Add more stats as needed
    };
  }
} 