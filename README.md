# Moola Coin Flip Challenge

An interactive 5-minute web simulation based on the famous Haghani–Dewey biased coin experiment. This educational game teaches users about probability, risk sizing, and behavioral finance while capturing leads for Moola's marketing funnel.

## 🎯 Project Overview

Players start with $25 and have 5 minutes to grow it to $150 using a biased coin that lands Heads 60% of the time. The game demonstrates how consistent, disciplined betting (Kelly Criterion) outperforms emotional gambling behaviors.

## 🚀 Features

- **Beautiful Mobile-First Design**: Glass morphism UI with Satoshi fonts and animated gradients
- **Real-Time Game Engine**: Server-side RNG with 1-second coin flip animations
- **Behavioral Analytics**: Tracks gambling patterns and provides educational feedback
- **Lead Capture**: Integrated with Supabase and Klaviyo for email/SMS marketing
- **Responsive Gaming**: Works perfectly in both portrait and landscape orientations
- **Educational Coach**: Post-game analysis explaining optimal strategies

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **UI Components**: shadcn/ui with custom glass morphism styling  
- **Backend**: Supabase (Database + Edge Functions)
- **Marketing**: Klaviyo integration for email automation
- **Icons**: Lucide React
- **Fonts**: Satoshi via Fontshare

## 🎨 Design System

- **Colors**: Blue (#3B82F6), Pink (#EC4899), Purple (#8B5CF6) gradient mesh
- **Typography**: Satoshi font family (400, 500, 600, 700)
- **Style**: Glass morphism with rounded corners and subtle animations
- **Mobile**: Touch-friendly 44px minimum tap targets

## 🎮 Game Flow

1. **Landing Page**: Animated hero with coin flip preview
2. **Lead Capture**: Name, email, optional phone with SMS opt-in
3. **Instructions**: 5-step explanation with pro tips
4. **Game Play**: 5-minute timer with real-time betting interface
5. **Results**: Score analysis with Moola Coach insights
6. **Social Sharing**: Share results to drive viral growth

## 📱 Mobile Optimization

- Responsive design works on all screen sizes
- Touch-optimized buttons and inputs
- Safe area handling for notched devices
- Portrait and landscape orientation support
- Fast 1.5-second game cycle for engaging rhythm

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/MoolaCopilot/coin-flip.git
   cd coin-flip
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your Supabase and Klaviyo credentials
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🗄 Database Schema

### Players Table
```sql
- id: UUID (primary key)
- name: TEXT
- email: TEXT (unique)
- phone: TEXT (optional)
- sms_opt_in: BOOLEAN
- created_at: TIMESTAMP
- total_games: INTEGER
- best_score: DECIMAL
- average_score: DECIMAL
```

### Games Table
```sql
- id: UUID (primary key)
- player_id: UUID (foreign key)
- balance: DECIMAL
- initial_balance: DECIMAL (25.00)
- target_balance: DECIMAL (150.00)
- time_remaining: INTEGER (milliseconds)
- game_started_at: TIMESTAMP
- game_ended_at: TIMESTAMP
- is_active: BOOLEAN
- is_completed: BOOLEAN
- total_flips: INTEGER
- win_count: INTEGER
- loss_count: INTEGER
- largest_bet: DECIMAL
- final_result: ENUM ('won', 'lost', 'timeout')
```

### Game Flips Table
```sql
- id: UUID (primary key)
- game_id: UUID (foreign key)
- flip_number: INTEGER
- bet_amount: DECIMAL
- bet_side: ENUM ('heads', 'tails')
- result: ENUM ('heads', 'tails')
- won: BOOLEAN
- balance_before: DECIMAL
- balance_after: DECIMAL
- timestamp: TIMESTAMP
```

## 🎯 Game Configuration

```typescript
const GAME_CONFIG = {
  initialBalance: 25,
  targetBalance: 150,
  gameDurationMs: 5 * 60 * 1000, // 5 minutes
  minBet: 0.01,
  coinBias: 0.6, // 60% heads
  quickChipPercentages: [10, 15, 20, 30, 40],
  quickChipAmounts: [0.25, 0.50, 1.00, 2.00, 3.00, 5.00],
};
```

## 📊 Behavioral Analysis

The game tracks several behavioral patterns:
- **Gambler's Fallacy**: Switching sides after streaks
- **Loss Chasing**: Increasing bets after losses  
- **Overconfidence**: Betting too much after wins
- **Consistency Score**: Variance in bet sizing
- **Hot Hand Fallacy**: Sticking with "lucky" sides

## 🚀 Deployment

The app is designed to deploy on Vercel with:
- Automatic builds from main branch
- Environment variables configured in dashboard
- Custom domain: `coin.moo.la`
- Edge Functions for game logic

## 📈 Marketing Integration

- **Klaviyo Lists**: Automatic subscriber management
- **Email Flows**: 3-part educational series post-game
- **SMS Follow-up**: Optional score sharing and replay prompts
- **Social Sharing**: Native Web Share API with fallbacks

## 🎓 Educational Goals

1. Teach Kelly Criterion through gameplay
2. Demonstrate behavioral finance concepts
3. Show value of disciplined risk management
4. Connect to Moola's automated investing platform
5. Generate qualified leads interested in smart investing

## 🔒 Security & Fair Play

- Server-authoritative random number generation
- Rate limiting per IP/session
- Input validation on all bets
- Anti-cheat detection for impossible scores
- HMAC verification for flip results

## 📄 License

This project is proprietary to Moola. All rights reserved.

## 🤝 Contributing

This is a private project. Contact the development team for contribution guidelines.

---

Built with ❤️ by the Moola team. Teaching the world to invest smarter, one coin flip at a time.