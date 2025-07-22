# Telegram Bot - Vercel Deployment

A simple Telegram bot built with Telegraf and deployed on Vercel using webhooks.

## Features

- **Start command** - Welcome message
- **Help command** - Shows available commands
- **Echo command** - Echoes back your message
- **Text handling** - Responds to any text message

## Setup

### 1. Prerequisites

- [Telegram Bot Token](https://core.telegram.org/bots#6-botfather) from BotFather
- [Vercel account](https://vercel.com)
- Node.js and npm installed locally

### 2. Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

### 3. Configuration

Edit `.env` file and add your Telegram bot token:

```env
BOT_TOKEN=your_actual_bot_token_here
```

### 4. Local Development

```bash
# Start local development server
npm run dev
```

The bot will be available at `http://localhost:3000`

## Deployment to Vercel

### Option 1: Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
npm run deploy
```

### Option 2: Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import the project in [Vercel Dashboard](https://vercel.com/dashboard)
3. Add environment variable `BOT_TOKEN` in project settings
4. Deploy

### Setting up the Webhook

After deployment, you need to set up the webhook URL for your bot:

1. Visit `https://your-vercel-domain.vercel.app/api/set-webhook`
2. Make a POST request to this endpoint
3. The webhook will be automatically configured

Or use curl:

```bash
curl -X POST https://your-vercel-domain.vercel.app/api/set-webhook
```

## API Endpoints

- `POST /api/webhook` - Handles incoming Telegram updates
- `POST /api/set-webhook` - Sets up the webhook URL for your bot

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `BOT_TOKEN` | Your Telegram bot token from BotFather | Yes |

## Commands

- `/start` - Start the bot
- `/help` - Show help message
- `/echo <message>` - Echo back your message

## Project Structure

```
telegrambot/
├── api/
│   ├── webhook.ts      # Main webhook handler
│   └── set-webhook.ts  # Webhook setup endpoint
├── bot.ts              # Original polling version (deprecated)
├── vercel.json         # Vercel configuration
├── package.json
├── tsconfig.json
└── .env.example
```

## Development Notes

- The bot uses webhooks instead of polling for Vercel compatibility
- Original `bot.ts` file is kept for reference but not used in production
- Webhook URL is automatically configured based on deployment domain

## Troubleshooting

1. **Bot not responding**: Check if webhook is properly set up
2. **Environment variables**: Ensure `BOT_TOKEN` is set in Vercel dashboard
3. **HTTPS required**: Telegram webhooks require HTTPS (Vercel provides this automatically)

## License

ISC 