# Changelog

All notable changes to **Togather** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Roadmap
- Push notifications for event reminders
- Dark mode toggle in settings
- Export attendance data to CSV
- Integration with Google Calendar
- Multi-language support (EN/ID toggle)
- Role templates (save frequently used role sets)

---

## [0.5.0] - 2025-12-11

### Added - UI/UX Polish & Leader Identity
- **Leader Profile Page** (`/profile`) - Edit full name and phone number
- **Profiles Table** - Database schema for leader identity
- **Coach Report Enhancement** - Uses leader's full_name instead of email
- **Dashboard Revamp** - Compact cards with gap-4 spacing, rounded-lg corners
- **Past Events Section** - "Riwayat" with grayed-out styling for archived events
- **Members Attendance Dots** - Visual indicators (🟢/🔴) for recent attendance history
- **Icon-only Add Button** - Minimized member add button in header
- **Outing Mode** - Toggle for location handling with Google Maps link support
- **Event Duplication** - DuplicateButton component (ready for integration)

### Changed
- Event cards now use `flex flex-col gap-4` for reliable 16px spacing
- Time picker simplified to hourly intervals (13:00-21:00)
- Location input defaults to "Via House" for non-outing events

---

## [0.4.0] - 2025-12-11

### Added - Live Tools
- **Tools Page** (`/tools`) - New tab in bottom navigation
- **Wheel of Fellowship** - Roulette spinner for random attendee selection
  - Fetches attendees marked as "Hadir" from latest event
  - Animated name cycling with slowdown effect
  - Confetti explosion on winner selection (canvas-confetti)
- **Deep Talk Cards** - Ice breaker question cards
  - 15 curated fellowship questions
  - Card flip animation (Framer Motion)
  - Progress tracking for used questions
- **Tab Interface** - Roda Undian | Kartu Sharing

### Dependencies
- Added `framer-motion` for animations
- Added `canvas-confetti` for celebration effects

---

## [0.3.0] - 2025-12-11

### Added - The People Engine
- **Members Directory** (`/members`) - CRUD for congregation members
- **Member Combobox** - Smart role assignment with member selection
- **Attendance System** - Mark members as Hadir/Ijin per event
- **Attendance List Component** - Interactive toggle buttons with summary
- **Coach Report Button** - Copy formatted attendance report to clipboard
- **Member Analytics** - Attendance dots in combobox showing recent history
- **Event Types** - Regular vs Gabungan (Joint Service) events
- **Marketing Blast** - WhatsApp template for Gabungan events

### Database
- `members` table with RLS policies
- `event_attendance` table for tracking
- `event_roles.member_id` foreign key

---

## [0.2.0] - 2025-12-11

### Added - Core Features
- **Event CRUD** - Create, read, update, delete events
- **Role Management** - Add/edit/delete roles per event
- **Role Assignment** - Assign members to roles with filled status
- **WhatsApp Share** - Share event details via WhatsApp
- **Status Badges** - Draft / Butuh Petugas / Siap Melayani
- **Event Detail Page** - Full event information with role list

### UI Components
- Bottom Navigation (Home, Buat, Tools, Jemaat)
- Date-Time Picker with calendar and time slots
- Dialog components for forms

---

## [0.1.0] - 2025-12-11

### Added - The Foundation
- **Next.js 15** setup with App Router
- **Supabase Authentication** - Magic Link (passwordless)
- **Database Schema**
  - `events` table with RLS
  - `event_roles` table with RLS
- **Protected Routes** - Middleware-based auth guard
- **Mobile-First Layout** - max-width 480px container
- **Design System** - Tailwind CSS + shadcn/ui components
- **Dark Mode Support** - System-based theme

### Tech Stack
- Next.js 15 (Turbopack)
- React 19
- TypeScript
- Supabase (Auth + Database)
- Tailwind CSS v4
- shadcn/ui components
- Lucide React icons

---

## Session Stats

📅 **Date:** December 11, 2025  
⏱️ **Duration:** ~12 hours  
🔧 **Files Created/Modified:** 50+  
🎨 **Components Built:** 25+  
📊 **Database Tables:** 5  
🚀 **Production URL:** https://togather.vercel.app
