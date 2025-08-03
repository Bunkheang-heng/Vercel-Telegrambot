import { CONFIG } from '../config/constants';
import { MESSAGES } from '../config/constants';

export class ResponseHandler {
  static async sendResponse(ctx: any, response: string): Promise<void> {
    if (response.length > CONFIG.MAX_RESPONSE_LENGTH) {
      const chunks = response.match(new RegExp(`.{1,${CONFIG.CHUNK_SIZE}}`, 'g')) || [response];
      for (const chunk of chunks) {
        await ctx.reply(chunk, { parse_mode: 'HTML' });
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay between chunks
      }
    } else {
      ctx.reply(response, { parse_mode: 'HTML' });
    }
  }

  static async showLoading(ctx: any): Promise<void> {
    // Send typing action to show loading
    await ctx.sendChatAction('typing');
  }

  static async sendResponseWithLoading(ctx: any, response: string): Promise<void> {
    // Show loading indicator
    await this.showLoading(ctx);
    
    // Longer delay to make loading visible (1-2 seconds)
    const loadingTime = Math.min(1500, response.length * 10); // Longer for longer responses
    await new Promise(resolve => setTimeout(resolve, loadingTime));
    
    // Send the actual response
    await this.sendResponse(ctx, response);
  }

  static async sendResponseWithAnimatedLoading(ctx: any, response: string): Promise<void> {
    // Send initial loading message
    const loadingMsg = await ctx.reply('🤔 <b>Kheang Bot is thinking...</b>', { parse_mode: 'HTML' });
    
    // Show typing indicator
    await this.showLoading(ctx);
    
    // Simulate thinking time based on response length
    const thinkingTime = Math.min(2000, response.length * 15);
    await new Promise(resolve => setTimeout(resolve, thinkingTime));
    
    // Delete loading message
    try {
      await ctx.deleteMessage(loadingMsg.message_id);
    } catch (error) {
      // Ignore if message can't be deleted
    }
    
    // Send the actual response
    await this.sendResponse(ctx, response);
  }

  static async handleError(ctx: any, error: any, logger: any): Promise<void> {
    const userId = ctx.from?.id?.toString() || 'unknown';
    
    let errorMessage = MESSAGES.NO_RESPONSE;
    
    if (error.message === 'Request timeout') {
      errorMessage = MESSAGES.TIMEOUT;
    } else if (error.message.includes('quota')) {
      errorMessage = MESSAGES.QUOTA_ERROR;
    }
    
    ctx.reply(errorMessage);
    logger.error(userId, 'error', error.message);
  }

  static formatRateLimitMessage(remaining: { minute: number; hour: number }): string {
    return `⏰ Rate limit exceeded!

You've used all your requests for this period.
• Minute limit: ${CONFIG.MAX_REQUESTS_PER_MINUTE}/min
• Hour limit: ${CONFIG.MAX_REQUESTS_PER_HOUR}/hour

Please wait a moment before trying again.`;
  }
} 