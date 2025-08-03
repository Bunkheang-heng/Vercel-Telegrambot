export class InputValidator {
  static validateMessage(message: string): { isValid: boolean; error?: string } {
    // Check if message exists
    if (!message || typeof message !== 'string') {
      return { isValid: false, error: 'Message is required' };
    }

    // Check message length
    if (message.length > 1000) {
      return { isValid: false, error: 'Message too long (max 1000 characters)' };
    }

    if (message.length < 1) {
      return { isValid: false, error: 'Message cannot be empty' };
    }

    // Check for malicious content
    const maliciousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /data:text\/html/gi,
      /vbscript:/gi,
      /on\w+\s*=/gi,
      /<iframe/gi,
      /<object/gi,
      /<embed/gi
    ];

    for (const pattern of maliciousPatterns) {
      if (pattern.test(message)) {
        return { isValid: false, error: 'Message contains invalid content' };
      }
    }

    return { isValid: true };
  }

  static sanitizeMessage(message: string): string {
    if (!message) return '';
    
    // Remove HTML tags
    let sanitized = message.replace(/<[^>]*>/g, '');
    
    // Remove potentially dangerous characters
    sanitized = sanitized.replace(/[<>]/g, '');
    
    // Trim whitespace
    sanitized = sanitized.trim();
    
    return sanitized;
  }

  static validateUserId(userId: string): boolean {
    if (!userId || typeof userId !== 'string') return false;
    if (userId.length > 50) return false;
    return /^[a-zA-Z0-9_-]+$/.test(userId);
  }

  static categorizeQuestion(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('project') || lowerMessage.includes('work') || lowerMessage.includes('build')) {
      return 'projects';
    }
    if (lowerMessage.includes('skill') || lowerMessage.includes('technology') || lowerMessage.includes('tech')) {
      return 'skills';
    }
    if (lowerMessage.includes('education') || lowerMessage.includes('study') || lowerMessage.includes('degree')) {
      return 'education';
    }
    if (lowerMessage.includes('award') || lowerMessage.includes('competition') || lowerMessage.includes('win')) {
      return 'awards';
    }
    if (lowerMessage.includes('experience') || lowerMessage.includes('job') || lowerMessage.includes('work')) {
      return 'experience';
    }
    if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('phone')) {
      return 'contact';
    }
    if (lowerMessage.includes('volunteer') || lowerMessage.includes('help') || lowerMessage.includes('event')) {
      return 'volunteer';
    }
    
    return 'general';
  }
} 