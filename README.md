# Togather

**Togather** is a specialized Companion App for Community Groups (Komsel). Built Mobile-First, it helps Cell Group Leaders manage events, track attendance, and run interactive activities - all from their phone.

![Project Status](https://img.shields.io/badge/Status-v1.0.0_Beta-success)
![Tech Stack](https://img.shields.io/badge/Built_With-Next.js_15_%2B_Supabase-black)

## ✨ Features

### 📅 Event Management
- Create Regular Komsel or Outing/Gabungan events
- Auto-seeded role templates (WL, Prayer, Song Leader)
- Google Maps integration for venue locations
- Share event info with one tap

### 👥 People Engine
- Member directory with status management
- Set members as Available/Unavailable with reason
- Visual attendance history (last 5 events)
- Auto-generated avatars

### 🎯 Smart Role Assignment
- Pinned CG Leader card (read-only)
- Unavailable members shown disabled with reason
- Prevents double-booking in same event

### 🎮 Gamified Tools
- **⚡ Swipe Attendance** - Tinder-style cards for fun attendance taking
- **🎡 Wheel of Fellowship** - Spin to pick random members
- **🃏 Ice Breaker Cards** - Deep Talk questions with flip animations

### 📊 Reporting
- Copy formatted Coach Report to clipboard
- Visual attendance dots per member

## 🚀 Local Setup

```bash
# Clone the repo
git clone https://github.com/pitmhz/togather.git
cd togather

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
```

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Database Setup
Run these migrations in Supabase SQL editor:
```sql
-- Member status fields
ALTER TABLE members 
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'available' CHECK (status IN ('available', 'unavailable')),
  ADD COLUMN IF NOT EXISTS unavailable_reason TEXT,
  ADD COLUMN IF NOT EXISTS unavailable_until DATE;
```

### Run Development Server
```bash
npm run dev
```

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router & Server Actions) |
| Language | TypeScript |
| Database & Auth | Supabase (PostgreSQL + Magic Link) |
| UI Library | Shadcn/UI + Tailwind CSS v4 |
| Animations | Framer Motion |
| Deployment | Vercel |

## ⚠️ Known Limitations

- **Single Leader Mode** - Currently optimized for one leader per account
- **No Multi-CG Support** - Each account manages one cell group
- **No Recurring Events** - Events must be created individually
- **UI Avatars Only** - No custom photo uploads yet

## 📚 Documentation

- [CHANGELOG.md](./CHANGELOG.md) - Version history
- [documentation/](./documentation/) - Screenshots and guides

## 📝 License

MIT License - See [LICENSE](./LICENSE) for details.

---
*Built with ❤️ for Community Group Leaders*