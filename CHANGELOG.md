# Changelog

All notable changes to Togather are documented in this file.

## [1.0.0] - 2025-12-12 - The "Serlie" Release 🎉

First Beta release for real-world testing with Community Group leaders.

### ✨ Features

#### Dashboard & Navigation
- **Mobile-First Dashboard** with horizontal carousel slider
- **Glassmorphism Bottom Nav** with smooth transitions
- **Pop-out Cards** with shadows that bleed past containers

#### Event Management
- **Regular Komsel Events** with auto-seeded role templates (WL, Prayer, Song Leader)
- **Outing/Gabungan Events** with Google Maps integration
- **Share Button** for quick event info distribution
- **Coach Report Generator** - Copy formatted attendance to clipboard

#### Smart Role Assignment
- **Virtual CG Leader** card pinned at top (read-only)
- **Availability Filtering** - Unavailable members shown disabled with reason
- **Already-Assigned Prevention** - Members can't be double-booked in same event
- **Attendance Dots** - Visual history in member combobox

#### People Engine
- **Member Directory** with 2-column grid layout
- **Status Management** - Set members as Available/Unavailable
- **Unavailable Reason & Date** - "Dinas Luar Kota (sampai 15 Des)"
- **UI Avatars** - Auto-generated profile pictures

#### Gamified Tools (Live Tools Tab)
- **⚡ Swipe Attendance** - Tinder-style cards for fun attendance taking
- **🎡 Wheel of Fellowship** - Spin to pick random members with confetti
- **🃏 Ice Breaker Cards** - Deep Talk questions with flip animations

### 🎨 UI/UX Polish
- Off-white page backgrounds (`bg-slate-50`)
- White cards with subtle borders and shadows
- Consistent header styling across all pages
- Smooth animations with Framer Motion

### 🗃️ Database Schema
- `events` - Event details with Regular/Gabungan types
- `event_roles` - Auto-seeded role assignments
- `members` - With status, unavailable_reason, unavailable_until, avatar_url
- `event_attendance` - Presence tracking
- `profiles` - Leader identity

---

## [0.5.0] - 2025-12-08 - Initial PWA Foundation

- Basic event CRUD
- Member management
- Simple attendance tracking
- Magic Link authentication
