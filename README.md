# Marketing Content AI Agent (Claude Powered)

Generate compelling marketing content for multiple platforms using Anthropic's Claude AI.

## Features

- **5 Platforms**: Twitter/X, LinkedIn, Email, Instagram, Facebook
- **5 Tones**: Professional, Casual, Enthusiastic, Informative, Humorous
- **A/B Testing**: Generate 1-5 variations per request
- **Copy & Export**: One-click clipboard and file export
- **Powered by Claude**: Using Anthropic's Claude Sonnet 4

## Live Demo

[View Live Demo](https://ai-marketing-agent-zeta.vercel.app/)

## Quick Start

### 1. Get Your Claude API Key

1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to "API Keys"
4. Click "Create Key"
5. Copy your API key (starts with `sk-ant-`)

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment

```bash
# Copy the example file
copy .env.local.example .env.local

# Edit .env.local and add your API key
# ANTHROPIC_API_KEY=sk-ant-YOUR-KEY-HERE
```

### 4. Run the App

```bash
npm run dev
```

Visit http://localhost:3000

## How to Use

1. **Enter Product Description**: Describe your product or campaign
2. **Select Platform**: Choose your target platform
3. **Choose Tone**: Pick the tone that matches your brand
4. **Set Variations**: Select 1-5 variations
5. **Generate**: Click "Generate Content"
6. **Copy or Export**: Use individual copy buttons or export all

## Cost Information

Claude API is very affordable:
- **Claude Sonnet 4**: ~$3 per million input tokens, ~$15 per million output tokens
- Each generation costs approximately **$0.01-0.03**
- Much more affordable than GPT-4!

## Example Use Cases

### E-commerce Product Launch
```
Product: Wireless headphones with 30-hour battery life, 
active noise cancellation, premium sound quality. $149.
```

### SaaS Feature Announcement
```
New AI-powered analytics dashboard. Real-time insights, 
custom reports, team collaboration. Available to all users.
```

### Service Business
```
Professional house cleaning service. Eco-friendly products, 
background-checked staff, 100% satisfaction guarantee.
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Anthropic Claude API
- **Icons**: Lucide React

## Project Structure

```
marketing-ai-agent/
├── app/
│   ├── api/generate/
│   │   └── route.ts          # Claude API endpoint
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main UI
├── .env.local.example        # Environment template
├── package.json              # Dependencies
└── README.md                 # This file
```

## Deploy to Vercel

1. Push your code to GitHub
2. Import in Vercel
3. Add environment variable: `ANTHROPIC_API_KEY`
4. Deploy!

Or use Vercel CLI:
```bash
vercel
```

## Troubleshooting

**Error: "Invalid API key"**
- Make sure key starts with `sk-ant-`
- No spaces in .env.local
- Restart dev server after changing .env.local

**Error: "Rate limit exceeded"**
- Check your Anthropic account credits
- Visit https://console.anthropic.com/

**Content not generating**
- Check terminal for error messages
- Verify API key is correct
- Check Anthropic API status

## Customization

### Add New Platform

Edit `app/page.tsx`:
```typescript
const platforms = [
  { id: 'tiktok' as Platform, name: 'TikTok', icon: '🎵', color: 'bg-black' },
];
```

Edit `app/api/generate/route.ts`:
```typescript
const platformPrompts: Record<string, string> = {
  tiktok: `Create an engaging TikTok caption...`,
};
```

### Change AI Model

Edit `app/api/generate/route.ts`:
```typescript
model: 'claude-sonnet-4-20250514', // or claude-3-5-sonnet-20241022 for cheaper
```

## Author

**Gianluca Buonanno**
- GitHub: [@gianluca-buonanno](https://github.com/gianluca-buonanno)
- Project Link: [https://github.com/gianluca-buonanno/AI-Marketing-Agent](https://github.com/gianluca-buonanno/AI-Marketing-Agent)

## Acknowledgments

- [Anthropic](https://www.anthropic.com/) for Claude AI
- [Vercel](https://vercel.com/) for hosting platform
- [Next.js](https://nextjs.org/) team for the amazing framework

## License

MIT License - free to use for personal or commercial projects.

---

Built with using Next.js, TypeScript, and Claude AI
