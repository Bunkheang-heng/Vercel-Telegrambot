export interface LogEntry {
  timestamp: string;
  userId: string;
  action: string;
  details?: string;
  userAgent: string;
  level: 'info' | 'error' | 'warn';
}

export class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Keep last 1000 logs in memory

  log(userId: string, action: string, details?: string, level: 'info' | 'error' | 'warn' = 'info'): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      userId,
      action,
      details,
      userAgent: 'KheangBot/1.0',
      level
    };
    
    this.logs.push(logEntry);
    
    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
    
    // Console output with emoji based on level
    const emoji = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : '📊';
    console.log(`${emoji} Activity Log:`, JSON.stringify(logEntry));
    
    // In production, you'd send this to a logging service
    // Example: await this.sendToLoggingService(logEntry);
  }

  error(userId: string, action: string, details?: string): void {
    this.log(userId, action, details, 'error');
  }

  warn(userId: string, action: string, details?: string): void {
    this.log(userId, action, details, 'warn');
  }

  getLogs(limit: number = 50): LogEntry[] {
    return this.logs.slice(-limit);
  }

  getLogsByUser(userId: string, limit: number = 20): LogEntry[] {
    return this.logs
      .filter(log => log.userId === userId)
      .slice(-limit);
  }

  getLogsByAction(action: string, limit: number = 20): LogEntry[] {
    return this.logs
      .filter(log => log.action === action)
      .slice(-limit);
  }

  // Clean up old logs (older than 24 hours)
  cleanup(): void {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    this.logs = this.logs.filter(log => new Date(log.timestamp) > oneDayAgo);
  }

  // Get statistics
  getStats(): { totalLogs: number; errorCount: number; warnCount: number; uniqueUsers: number } {
    const uniqueUsers = new Set(this.logs.map(log => log.userId)).size;
    const errorCount = this.logs.filter(log => log.level === 'error').length;
    const warnCount = this.logs.filter(log => log.level === 'warn').length;
    
    return {
      totalLogs: this.logs.length,
      errorCount,
      warnCount,
      uniqueUsers
    };
  }
} 