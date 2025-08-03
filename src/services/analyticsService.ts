export interface AnalyticsEvent {
  timestamp: Date;
  userId: string;
  action: string;
  details?: any;
  responseTime?: number;
  success: boolean;
}

export interface AnalyticsStats {
  totalUsers: number;
  totalMessages: number;
  averageResponseTime: number;
  popularQuestions: Map<string, number>;
  errorRate: number;
  activeUsers: Set<string>;
}

export class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private stats: AnalyticsStats = {
    totalUsers: 0,
    totalMessages: 0,
    averageResponseTime: 0,
    popularQuestions: new Map(),
    errorRate: 0,
    activeUsers: new Set()
  };

  trackEvent(userId: string, action: string, details?: any, responseTime?: number, success: boolean = true): void {
    const event: AnalyticsEvent = {
      timestamp: new Date(),
      userId,
      action,
      details,
      responseTime,
      success
    };

    this.events.push(event);
    this.updateStats(event);
  }

  private updateStats(event: AnalyticsEvent): void {
    // Update total messages
    if (event.action === 'message_received') {
      this.stats.totalMessages++;
    }

    // Update active users
    this.stats.activeUsers.add(event.userId);
    this.stats.totalUsers = this.stats.activeUsers.size;

    // Update response time
    if (event.responseTime) {
      const currentTotal = this.stats.averageResponseTime * (this.stats.totalMessages - 1);
      this.stats.averageResponseTime = (currentTotal + event.responseTime) / this.stats.totalMessages;
    }

    // Update popular questions
    if (event.action === 'message_received' && event.details?.category) {
      const category = event.details.category;
      this.stats.popularQuestions.set(category, (this.stats.popularQuestions.get(category) || 0) + 1);
    }

    // Update error rate
    const recentEvents = this.events.filter(e => 
      Date.now() - e.timestamp.getTime() < 3600000 // Last hour
    );
    const errors = recentEvents.filter(e => !e.success).length;
    this.stats.errorRate = recentEvents.length > 0 ? errors / recentEvents.length : 0;
  }

  getStats(): AnalyticsStats {
    return { ...this.stats };
  }

  getPopularQuestions(limit: number = 5): Array<{ category: string; count: number }> {
    return Array.from(this.stats.popularQuestions.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  getRecentActivity(minutes: number = 60): AnalyticsEvent[] {
    const cutoff = new Date(Date.now() - minutes * 60000);
    return this.events.filter(event => event.timestamp > cutoff);
  }

  getUserActivity(userId: string): AnalyticsEvent[] {
    return this.events.filter(event => event.userId === userId);
  }

  getPerformanceMetrics(): {
    averageResponseTime: number;
    errorRate: number;
    totalRequests: number;
    successRate: number;
  } {
    const totalRequests = this.events.length;
    const successfulRequests = this.events.filter(e => e.success).length;
    
    return {
      averageResponseTime: this.stats.averageResponseTime,
      errorRate: this.stats.errorRate,
      totalRequests,
      successRate: totalRequests > 0 ? successfulRequests / totalRequests : 1
    };
  }

  cleanup(): void {
    // Keep only last 24 hours of events
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    this.events = this.events.filter(event => event.timestamp > cutoff);
  }
} 