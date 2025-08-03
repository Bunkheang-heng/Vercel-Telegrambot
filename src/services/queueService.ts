export interface QueueItem {
  userId: string;
  message: string;
  ctx: any;
  timestamp: number;
  priority: number;
}

export class QueueService {
  private queue: QueueItem[] = [];
  private processing = false;
  private maxConcurrent = 3;
  private activeProcessors = 0;

  async addToQueue(userId: string, message: string, ctx: any, priority: number = 1): Promise<void> {
    const item: QueueItem = {
      userId,
      message,
      ctx,
      timestamp: Date.now(),
      priority
    };

    // Add to queue based on priority
    const insertIndex = this.queue.findIndex(qItem => qItem.priority < priority);
    if (insertIndex === -1) {
      this.queue.push(item);
    } else {
      this.queue.splice(insertIndex, 0, item);
    }

    // Start processing if not already running
    if (!this.processing) {
      this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    this.processing = true;
    
    while (this.queue.length > 0 && this.activeProcessors < this.maxConcurrent) {
      const item = this.queue.shift();
      if (item) {
        this.activeProcessors++;
        this.processItem(item).finally(() => {
          this.activeProcessors--;
        });
      }
    }
    
    this.processing = false;
  }

  private async processItem(item: QueueItem): Promise<void> {
    try {
      // Check if request is too old (older than 30 seconds)
      if (Date.now() - item.timestamp > 30000) {
        await item.ctx.reply('⏰ Sorry, your request timed out. Please try again.');
        return;
      }

      // Send typing indicator
      await item.ctx.sendChatAction('typing');
      
      // Process the message (this will be handled by the main bot logic)
      // The actual AI processing will happen in the main handler
      
    } catch (error) {
      console.error('Queue processing error:', error);
      try {
        await item.ctx.reply('❌ An error occurred while processing your request. Please try again.');
      } catch (e) {
        console.error('Failed to send error message:', e);
      }
    }
  }

  getQueueLength(): number {
    return this.queue.length;
  }

  getActiveProcessors(): number {
    return this.activeProcessors;
  }

  clearQueue(): void {
    this.queue = [];
  }
} 