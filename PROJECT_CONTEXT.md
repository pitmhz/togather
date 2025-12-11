# PROJECT CONTEXT: Togather (Micro-SaaS)

## 1. Product Vision
**Name:** Togather
**Type:** PWA (Progressive Web App) for Church Cell Group (Komsel) Management.
**Core Value:** A streamlined web app for Cell Group Leaders (CGL) to schedule meetings and assign roles without friction.
**Long-term Goal:** Evolving into a comprehensive "Ministry Operating System" with AI-assisted note-taking, WhatsApp integration, and automated recurring schedules.

## 2. Tech Stack (Scalable Foundation)
- **Frontend:** Next.js 15 (App Router, Server Actions).
- **Styling:** Tailwind CSS, Shadcn UI (Zinc + Indigo-600 Theme), Lucide Icons, Framer Motion (for polished UX).
- **Backend/DB:** Supabase (PostgreSQL) - chosen for high scalability.
- **Auth:** Supabase Auth (Magic Link only) - passwordless for elderly user accessibility.
- **Deployment:** Vercel (Hobby Tier -> Pro).
- **PWA:** `next-pwa` / `@ducanh2912/next-pwa`.

## 3. Database Schema (Deployed)
Current "Minimum Viable Schema" but designed for extension:
- **`profiles`**: id (uuid, PK), email, full_name.
- **`events`**: id, user_id (FK), title, topic, event_date, location.
- **`event_roles`**: id, event_id (FK), role_name (text), assignee_name (text), is_filled (bool).
- **Security:** RLS Policies are STRICT enabled.

## 4. MVP Roadmap (Current 12-Hour Sprint)
Focus on the "Tracer Bullet" method:
1. **Auth:** Login page with Magic Link.
2. **Dashboard:** List upcoming events.
3. **Create Event:** Manual CRUD (Date, Location, Topic).
4. **Role Assignment:** Dynamic route `/events/[id]` where CGL can assign names to roles manually.
5. **Sharing:** Public read-only view for members via link sharing.

## 5. Future Roadmap (Do NOT Build Now, But Code for Extensibility)
*Keep these in mind so the code structure remains modular:*
- **Recurring Events:** The event creation logic should be reusable for future cron jobs.
- **WhatsApp Integration:** The "Share" button should be easily swappable with a WhatsApp API trigger later.
- **AI Summary:** Database structure should allow attaching text/audio summaries to events later.
- **Member Database:** `assignee_name` is currently text, but will eventually link to a `users` table.

## 6. Design Guidelines (Vibecoder Style)
- **Primary Color:** Indigo-600 (`bg-indigo-600`, `text-indigo-600`).
- **Font:** Plus Jakarta Sans (Headings), Inter (Body).
- **UX Principle:** "One-Handed Operation". Mobile-first. Use Drawers/Sheets instead of Modals where possible.
- **Visuals:** Clean, spiritual but modern (Linear/Vercel vibe), Dark Mode ready.

## 7. Constraints
- No complex group permission logic yet (1 User = 1 Admin).
- No native mobile build (APK/IPA).
- No In-App Chat.

## 8. UI Layout Strategy (STRICT)
- **Mobile-First Enforcement:** The app must look like a mobile app even on desktop.
- **Root Layout Implementation:**
  - Wrap the main content in a container: `max-w-[480px] mx-auto min-h-screen bg-background shadow-2xl border-x`.
  - The outer body background (visible on desktop) should be `bg-zinc-100 dark:bg-zinc-950`.
  - No complex responsive grids. Keep it vertical stack (Single Column).