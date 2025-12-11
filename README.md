# Togather: Community Management PWA

**Togather** is a specialized Micro-SaaS designed to streamline the coordination of Church Cell Groups (Komsel). Built with a **Mobile-First** approach, it eliminates the chaos of WhatsApp scheduling by centralizing event dates and role assignments (Worship Leader, Prayer, etc.) in one seamless Progressive Web App.

![Project Status](https://img.shields.io/badge/Status-v0.5.0-success)
![Tech Stack](https://img.shields.io/badge/Built_With-Next.js_15_%2B_Supabase-black)
![Methodology](https://img.shields.io/badge/Dev_Method-AI--Assisted_Vibecoding-purple)

## 📚 Documentation

- **[CHANGELOG.md](./CHANGELOG.md)** - Complete version history and feature log
- **[documentation/](./documentation/)** - Screenshots, design decisions, and guides

## ⚡ The "12-Hour Build" Challenge

This project was built from scratch in **under 12 hours** as a case study in **"Vibecoding"** (AI-Augmented Development).

Instead of traditional hand-coding, I acted as the **Lead Architect & Product Manager**, orchestrating Large Language Models to handle the implementation details while I focused on:
* **System Architecture:** Designing the Scalable DB Schema on Supabase.
* **Product Strategy:** Deciding on PWA over Native for zero-friction user adoption.
* **Problem Solving:** Handling edge cases in Auth and Rate Limiting.
* **UI/UX Direction:** Enforcing a centered mobile-native layout on desktop.

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router & Server Actions) |
| Language | TypeScript |
| Database & Auth | [Supabase](https://supabase.com/) (PostgreSQL + Magic Link Auth) |
| UI Library | [Shadcn/UI](https://ui.shadcn.com/) + Tailwind CSS v4 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Deployment | Vercel |

## ✨ Features

### Core Features
- **Zero-Password Login** - Authentication via Email Magic Link (elderly-friendly)
- **Mobile-First Experience** - PWA-ready design that feels native on iOS/Android
- **Event Dashboard** - Centralized view of upcoming meetings with status badges
- **Role Management** - Create events and assign roles to members
- **Attendance System** - Track Hadir/Ijin with visual analytics

### Live Tools 🎮
- **Wheel of Fellowship** - Roulette spinner for random member selection with confetti!
- **Deep Talk Cards** - Ice breaker questions with card flip animations

### People Engine 👥
- **Member Directory** - CRUD for congregation members
- **Smart Role Assignment** - Combobox with attendance history dots
- **Coach Report** - Copy formatted attendance report to clipboard

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/pitmhz/togather.git
cd togather

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 📊 Database Schema

```
events          → Event details (title, date, location, type)
event_roles     → Roles per event (WL, Prayer, etc.)
members         → Congregation directory
event_attendance → Attendance tracking per event
profiles        → Leader identity (name, phone)
```

## 🧠 Lessons Learned

* **PWA > Native:** For community apps, removing the "Install from PlayStore" barrier increases adoption significantly.
* **AI as a Force Multiplier:** Using AI allowed focusing on high-level logic while AI handles implementation details.
* **Constraints Breed Speed:** Killing features like "Recurring Events" and "In-app Chat" was crucial to shipping a functional MVP in 12 hours.

## 📝 License

MIT License - See [LICENSE](./LICENSE) for details.

---
*Built with ❤️ and ☕ during a legendary 12-hour build session*