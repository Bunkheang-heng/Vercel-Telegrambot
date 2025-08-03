import { GoogleGenerativeAI } from '@google/generative-ai';
import { CONFIG, MESSAGES } from '../config/constants';

export interface UserSession {
  messageCount: number;
  lastInteraction: Date;
}

export class AIService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private userSessions: Map<string, UserSession> = new Map();

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.model = this.genAI.getGenerativeModel({
      model: CONFIG.MODEL,
      generationConfig: {
        maxOutputTokens: CONFIG.MAX_TOKENS,
        temperature: CONFIG.TEMPERATURE,
      }
    });
  }

  async generateResponse(message: string, userId: string, personalInfo: any): Promise<string> {
    const userSession = this.userSessions.get(userId) || { messageCount: 0, lastInteraction: new Date() };
    userSession.messageCount++;
    userSession.lastInteraction = new Date();
    this.userSessions.set(userId, userSession);

    const context = `You are Kheang Bot, a professional AI assistant for Heng Bunkheang (Kheang).

Kheang's Information:
${JSON.stringify(personalInfo, null, 2)}

STRICT INSTRUCTIONS:
- ONLY answer questions about Kheang (Heng Bunkheang)
- If asked about ANYTHING else (math, weather, general knowledge, other people, etc.), respond with:
  "I'm Kheang Bot, designed specifically to help you learn about Heng Bunkheang (Kheang). I can tell you about his background, experience, projects, skills, awards, and more. What would you like to know about Kheang?"
- Do NOT answer questions about:
  • Mathematics or calculations
  • Weather or current events
  • General knowledge questions
  • Other people or celebrities
  • Technical problems unrelated to Kheang
  • Any topic not directly about Kheang
- When mentioning Kheang's projects, use proper formatting:
  • Use bullet points (•) for lists
  • Use Telegram bold formatting with <b> tags for project names
  • Include project links when available using HTML anchor tags
  • Format: "• <b>Project Name</b>: description (<a href='link'>View Project</a>)"
  • Never use markdown ** or * symbols
  • Always include the actual project links from the data when available
- This is message #${userSession.messageCount} from this user

User Question: ${message}`;

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), CONFIG.TIMEOUT)
    );

    const apiCall = this.model.generateContent(context);
    const result = await Promise.race([apiCall, timeoutPromise]) as any;
    const response = await result.response;
    
    return response.text() || MESSAGES.NO_RESPONSE;
  }

  getUserSession(userId: string): UserSession | undefined {
    return this.userSessions.get(userId);
  }

  cleanupOldSessions(): void {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 3600000);
    
    for (const [userId, session] of this.userSessions.entries()) {
      if (session.lastInteraction < oneHourAgo) {
        this.userSessions.delete(userId);
      }
    }
  }
} 