# Changelog

All notable changes to Togather are documented in this file.

## [1.1.0] - 2025-12-12 - The "Group Architecture" Release 🏢

Major refactoring session: Moved from single-user to SaaS-style group architecture.

### 🏗️ Architecture Changes

#### Group-Based Data Model
- **NEW `groups` table** with `join_code` for shared access (e.g., "SERLIE01")
- **Added `group_id`** to `members` and `events` tables
- **Migrated from `user_id`** filtering to `group_id` grouping
- **Data rescue script** - Migrates all existing data to "Komsel Serlie" group

#### RLS Policy Overhaul
- **Dropped** old `user_id` based policies
- **MVP policies** - All authenticated users can read (will tighten later)
- **Group-based visibility** - Members of a group see shared data

### 🎨 Notion Visual Overhaul

#### Global Design System (`globals.css`)
- **Background**: `#FBFBFA` (Notion off-white)
- **Text**: `#37352F` (Charcoal, not pure black)
- **Primary Button**: `#191919` (Solid black)
- **Borders**: `#E3E3E3` (Omnipresent light gray)
- **Focus Ring**: `#2383E2` (Blue)

#### Login Page Redesign
- Centered layout with emoji header (🤝)
- Clean email input with light gray background
- Black "Lanjutkan dengan Email" primary button
- White secondary buttons with gray borders
- Explicit dev login buttons (no hidden menu)
- OR divider separating auth methods

#### Dashboard Cards
- **Removed shadows** - Using borders for hierarchy
- **Flat hover** - `bg-[#F7F7F5]` tint instead of lift
- **Pastel badges** - Notion-style tag colors:
  - Draft: `#E3E3E3` / `#787774`
  - Butuh Petugas: `#FADEC9` / `#D9730D`  
  - Siap Melayani: `#DBEDDB` / `#0F7B6C`
- **Emoji header** - Display group name (e.g., "Komsel Serlie")

### 🔐 Role-Based Access (Attempted, Then Replaced)

#### Emergency Leader Feature (REMOVED)
- ~~Added `temp_admin_until` column~~
- ~~Acting Leader badge with 24h access~~
- ~~Grant/Revoke dropdown items~~
- **Replaced by**: Group owner is now the only admin

#### What Was Removed
- `grantTempAdmin` / `revokeTempAdmin` actions
- `checkTempAdmin` / `isLeaderAsync` utilities
- Acting Leader (👑) badge
- "Jadikan Acting Leader" dropdown item

### 🛠️ Developer Experience

#### Dev Login Shortcut
- **NEW**: Explicit login buttons on login page
- "Login as Leader (Serlie)" - `pietermardi@gmail.com`
- "Login as Member" - `212011557@stis.ac.id`
- Uses `signInAsDev` server action with hardcoded password

### 🐛 Bug Fixes

#### Data Visibility Issues
- **Fixed**: Members page showing empty due to `.eq('user_id')` filter
- **Fixed**: Events page with stale user_id filtering
- **Removed**: All `user_id` based query filters
- **Now relies** on RLS policies for data visibility

### 📁 Files Changed

#### New Files
- `supabase/migrations/create_groups_architecture.sql`
- `supabase/migrations/update_rls_public_read.sql`
- `supabase/migrations/add_member_email_temp_admin.sql`
- `lib/user-role.ts` (then partially removed)

#### Modified Files
- `app/globals.css` - Notion color palette
- `app/login/page.tsx` - Complete redesign with dev buttons
- `app/(authenticated)/dashboard/page.tsx` - Group fetch, Notion styling
- `app/(authenticated)/members/page.tsx` - Removed user_id filter, debug logging
- `app/(authenticated)/members/member-item.tsx` - Removed temp admin UI
- `app/(authenticated)/members/actions.ts` - Added email field support
- `app/(authenticated)/profile/page.tsx` - Dynamic role label

#### Removed Files
- `components/dev-login-menu.tsx` - Moved to login page

---

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
