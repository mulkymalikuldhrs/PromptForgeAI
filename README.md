# PromptForge AI Specialist

![PromptForge AI Cover](https://raw.githubusercontent.com/mulkymalikuldhrs/PromptForgeAI/main/public/promptforge-cover.png)

## 🔥 Project Overview

PromptForge AI Specialist is an advanced prompt engineering platform without filters, designed to research, analyze, and enhance AI prompts from various sources. The platform provides powerful tools for prompt creation, testing, and management with premium features for subscribers.

Specializing in unfiltered leaked prompts, NSFW prompts, and everything about prompts - this is the ultimate tool for prompt engineering without limitations.

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

### v0.2.0 (2025-07-13)
- **UI/UX Improvements**:
  - Redesigned modern interface with dark mode support
  - Enhanced responsive layout for all device sizes
  - Added tooltips and improved user guidance
  - Implemented drag-and-drop file uploads
  - Added example prompts showcase

- **Feature Enhancements**:
  - Added support for multiple AI models (GPT, Claude, Gemini, Llama)
  - Implemented export functionality (TXT, JSON, MD, YAML)
  - Added sharing capabilities (link, email, social media)
  - Enhanced sandbox testing with real-time feedback
  - Improved prompt parsing and enhancement algorithms

- **Security & Performance**:
  - Implemented IP-based abuse prevention
  - Added secure authentication with wallet support
  - Optimized database queries for faster response times
  - Enhanced error handling and user feedback

### v0.1.0 (2025-06-30) - Initial Release
- Basic project structure and components
- Prompt analysis and enhancement functionality
- User authentication system
- Premium vs. free tier limitations
- Database schema and API routes
- Initial implementation of prompt crawler

## 📌 Todo: Next Implementation

1. **API Integration**:
   - Integrate with OpenAI, Anthropic, and Google APIs
   - Implement rate limiting and usage tracking
   - Create fallback mechanisms for API failures

2. **Advanced Features**:
   - Implement prompt chaining functionality
   - Build visual prompt builder interface
   - Create prompt version control system
   - Develop AI-powered prompt suggestion engine

3. **Marketplace Development**:
   - Build prompt marketplace infrastructure
   - Implement rating and review system
   - Create prompt monetization system
   - Develop featured prompts showcase

4. **Enterprise Features**:
   - Implement team collaboration tools
   - Create organization-level admin controls
   - Develop custom branding options
   - Build advanced analytics dashboard

5. **Mobile Experience**:
   - Develop native mobile applications
   - Optimize responsive design for all devices
   - Implement offline mode capabilities

6. **Testing & Deployment**:
   - Add comprehensive test coverage
   - Implement CI/CD pipeline
   - Deploy to production environment
   - Set up monitoring and alerting systems

## 👨‍💻 Credits

Developed by Mulky Malikul Dhaher  
Email: mulkymalikuldhr@technologist.com

## 📄 License

This project is proprietary and not open for redistribution or use without explicit permission.

---

PromptForge AI Specialist - Unleashing the full potential of prompt engineering without limits.
