# PromptForge AI Specialist

![PromptForge AI Cover](https://raw.githubusercontent.com/mulkymalikuldhrs/PromptForgeAI/main/public/promptforge-cover.png)

## 🔥 Project Overview

PromptForge AI Specialist is an advanced prompt engineering platform without filters, designed to research, analyze, and enhance AI prompts from various sources. The platform provides powerful tools for prompt creation, testing, and management with premium features for subscribers.

## 🔗 Key Features

### 1. Prompt Engine & AI Specialist
- Auto-scrape prompts from GitHub, Pastebin, forums, and PDFs
- Automatic parsing into structured components: System, Instruction, Input, Output Template
- AI-powered prompt enhancement based on user intent
- Sandbox testing via WebLLM or API (OpenAI/Ollama)

### 2. Prompt Log and Consistency
- Detailed logging of user requests:
  - Original Prompt, Enhanced Prompt, Intent
  - Version, Timestamp, Source URL
- Export options: .txt, .json, .yaml, or shareable URL

### 3. Prompt Limiter & Access Control
- Free tier: 5 prompts per day, no export/import
- Premium tier: Unlimited prompts, export, import, sandbox testing

### 4. Payment & Subscription
- Multiple payment methods:
  - Credit/debit cards (Stripe/Midtrans/Xendit)
  - Google Pay / Apple Pay
  - Cryptocurrency (MetaMask, WalletConnect)
  - Paylink (Qiro, Paylink.id)
  - Skrill (optional)
- Secure payment processing with anti-double charge protection
- Webhook handlers for payment status synchronization

### 5. IP Protection & Abuse Prevention
- IP tracking during registration
- Prevention of multi-account creation from same IP
- VPN detection with additional verification requirements

## 💻 Tech Stack

- **Frontend**: Next.js + TailwindCSS
- **Backend**: Next.js API routes + Supabase
- **LLM Engine**: OpenAI, Claude, Ollama, WebLLM
- **Agent Modules**:
  - crawlerAgent.js
  - promptParserAgent.js
  - intentToPromptAgent.js
  - promptEnhancerAgent.js
  - sandboxExecutionAgent.js
- **Storage**: Supabase DB + Redis (optional cache)
- **Auth**: Supabase Auth (email/wallet)
- **Payment**: Stripe API + webhooks

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Supabase account
- Stripe account (for payment processing)

### Installation

1. Clone the repository
```bash
git clone https://github.com/mulkymalikuldhrs/PromptForgeAI.git
cd PromptForgeAI
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
OPENAI_API_KEY=your_openai_api_key
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📋 Project Structure

```
PromptForgeAI/
├── public/               # Static assets
├── src/
│   ├── agents/           # AI agent modules
│   ├── components/       # React components
│   ├── database/         # Database models and prompt data
│   ├── pages/            # Next.js pages
│   │   ├── api/          # API routes
│   │   └── ...           # Page components
│   ├── styles/           # Global styles
│   └── utils/            # Utility functions
├── docs/                 # Documentation
└── ...                   # Config files
```

## 📊 Database Schema

### Users Table
- id
- email / wallet
- ip_address
- user_agent
- premium_status (FREE, MONTHLY, YEARLY, LIFETIME)
- prompt_count (daily)
- created_at, updated_at

### Prompt Logs Table
- id
- user_id
- source_type (text/url/upload)
- original_prompt
- enhanced_prompt
- output_preview
- version
- created_at

### Shared Prompts Table
- id
- prompt_id
- share_slug
- created_at

## 🌟 Future Add-ons

- NFT-based lifetime premium access (Web3 mode)
- Prompt Marketplace (share & rate prompts)
- Prompt Chain Visual Editor (drag-drop builder)
- Voice-to-prompt & reverse prompt deconstruction
- Prompt tagging & AI-driven search

## 📝 Changelog

### v0.1.0 (Initial Release)
- Basic project structure and components
- Prompt analysis and enhancement functionality
- User authentication system
- Premium vs. free tier limitations
- Database schema and API routes

## 📌 Todo: Next Implementation

1. Complete the authentication flow with Supabase
2. Implement the payment processing with Stripe
3. Develop the crawler agent for online prompt fetching
4. Build the sandbox testing environment
5. Create the export/import/share functionality
6. Add comprehensive test coverage
7. Deploy to production environment

## 👨‍💻 Credits

Developed by Mulky Malikul Dhaher  
Email: mulkymalikuldhr@technologist.com

## 📄 License

This project is proprietary and not open for redistribution or use without explicit permission.

---

PromptForge AI Specialist - Unleashing the full potential of prompt engineering without limits.