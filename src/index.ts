import dotenv from 'dotenv';
import { KheangBot } from './bot/KheangBot';

// Load environment variables
dotenv.config();

// Launch the professional bot
const bot = new KheangBot();
bot.launch(); 