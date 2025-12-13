# Changelog

All notable changes to Togather are documented in this file.

## [1.3.0-beta] - 2025-12-14 - The "First Impression" Update 🎯

Major overhaul of the first-time user experience with Luma-style authentication and onboarding.

### 🔐 Auth Overhaul
- **Merged Invite Flow**: Invite code entry now integrated into Login Screen (Luma Bottom Sheet style).
- **Strict Middleware Redirects**: Session check runs first → then onboarding status check. No more accidental skips.
- **Human-Friendly Errors**: New error pages with randomized metaphors (Cafe, Kitchen, etc.) for a softer experience.
- **Phantom Dev Mode**: Restored 7x tap on logo to reveal dev login shortcuts.

### 🚀 Onboarding 2.0
- **Stacked & Expandable Role Cards**: New "Leader vs Member" selection with detailed benefits breakdown.
- **Luma Design Tokens**: Soft bubble inputs, pill buttons, squircle avatars.
- **Avatar Selector**: Interactive avatar picker with preset options.
- **Safety Friction Modal**: Confirmation dialog for Member joining to prevent accidental clicks.

### 👥 Member Experience Overhaul
- **Profile Unification**: Reused Dashboard Hero Card (MemberPassCard) for Member Detail pages - consistent visual identity.
- **Member List 2.0**: Expandable Accordion cards with Quick Actions (View Profile, WhatsApp, Deactivate).
- **Lifecycle Management**: Added "Danger Zone" to handle Unavailable (temporary) and Inactive (permanent) member states.
- **Status Tracking**: Members can be set as "Tidak Tersedia" with reason and date, or "Nonaktif" permanently.
- **Visual Status Indicators**: Grayscale + badges for inactive members, amber badges for unavailable members.

### 🎨 Visuals & UX Delight
- **Notion-Style Avatars**: Restored DiceBear "Notionists" collection as default with warm neutral backgrounds.
- **Playful MBTI Fallback**: Added randomized Gen-Z humor quotes for empty MBTI states (e.g., "Belum nyetel MBTI nih, rada mager 😴").
- **Inline WhatsApp Button**: Moved WhatsApp CTA from standalone to inline with phone number in Contact card.
- **MBTI Card Polish**: Removed white gap between card border and colored header.

### 🛠️ Dev Tools
- **God Mode Trigger**: 7x tap on profile avatar reveals admin override panel.
- **Admin Role Toggle**: Quick switch between admin/member roles for testing.

### 🎨 Visuals
- **iOS-Style Bottom Sheets**: Smooth drawer animations for all modals.
- **Expandable Cards**: Framer Motion powered accordion effects.
- **Refined Typography**: Consistent heading hierarchy across onboarding steps.

---

## [1.2.0-beta] - 2025-12-14 - The Luma Update 🌗

We have completed a massive 10-hour sprint involving a Major Visual Overhaul and Architecture Shift.

### 🎨 Visual & UX Overhaul
- **Luma Design System**: Complete adoption of iOS-style aesthetics with rounded UI, glassmorphism, and clean typography.
- **Smart Navigation**: Simplified bottom bar (4 items) and a dynamic auto-hiding global header that reacts to scroll direction.
- **Dashboard 2.0**: New "Hero Card" featuring dynamic time-based greetings and attendance streak visualization.
- **Safe Sat-Set Protocol**: Optimistic UI updates with haptic feedback for instant interaction response.

### 🏗️ Micro-Apps Architecture
- **Warby Parker Stack**: Replaced the static tools list with a dynamic apps stack on the Dashboard.
- **New Micro-Apps**:
  - **Wheel of Fellowship**: Dedicated page for picking members.
  - **Ice Breaker Cards**: Interactive card decks.
  - **Swipe Attendance**: Tinder-style attendance tracking.
  - **Birthday Spotlight**: Horizontal scrolling list of upcoming birthdays.

### 👥 Member Experience
- **Advanced Filtering**: Added "Advanced Sort" to member list with Life Stage (Young Pro, Lansia) and MBTI (Introvert/Extrovert) filters.
- **Compact List**: Redesigned member list with avatars and expandable "Show More" functionality.
- **FAB**: New Floating Action Button for adding members, positioned perfectly for mobile thumbs.

### 🔐 Security & Data
- **Privacy Shield**: Automatic masking of sensitive data (emails, phones) based on user privacy settings.
- **Audit Logs**: Comprehensive tracking of all admin actions (create, update, delete) for accountability.

---


Major design system update implementing iOS-style aesthetics inspired by the Luma app.

### 🎨 Design System Changes

#### Global Tokens (`globals.css`)
- **Background**: Light gray (#F3F4F6) - White cards now pop.
- **Radius**: Increased base from 6px to 16px (1rem).
- **Colors**: Updated to modern neutral palette.

#### Button Component
- **Shape**: Pill-shaped (rounded-full) across all variants.
- **Size**: Increased touch targets (h-12 default).
- **Primary**: Pure black with white text.
- **Destructive**: Soft red background (not harsh).

#### Card Component
- **Shape**: Rounded-2xl (24px corners).
- **Style**: White bg, no border, subtle shadow.
- **Padding**: Reduced for tighter layouts.

#### Input Component
- **Style**: No borders, gray bubble background.
- **Focus**: White background with subtle ring.

#### Drawer Component
- **Shape**: Very rounded top (32px).
- **Overlay**: Blurred backdrop (backdrop-blur-sm).

### 🆕 New Components
- **IOSGroup**: Luma-style container for grouped settings.
  - `<IOSGroup>`, `<IOSGroupItem>`, `<IOSGroupLabel>`

---

## [1.1-beta] - 2025-12-12 - The "Strategic Core" Checkpoint 🛡️

A massive stability and feature update focusing on Role-Based Access Control (RBAC), Member Demographics, and Developer Tooling. This release marks the stable point before the upcoming Luma Visual Overhaul.

### 🛡️ Role-Based Access Control (RBAC)
- **Role System**: Added `role` column (`admin`, `member`, `owner`) to `members` table.
- **Permission Guards**:
  - Only Admins can create/edit/delete events.
  - Only Admins can manage members (Add, Deactivate, Delete).
  - Only Admins can modify "Secret" server data.
- **UI Visibility**:
  - "Crown" icon for Admin/Owner users.
  - "Tools" page is now locked behind Admin access.
  - "Add Member" button hidden for non-admins.
- **Member Management**:
  - New "Promote to Admin" / "Demote to Member" actions in Drawer.
  - Added "Deactivate" (Soft Delete) vs "Delete Permanently" options.

### 👥 People Intelligence (Demographics & MBTI)
- **Life Stage Engine**:
  - Automatic calculation based on Birth Date.
  - Categories: Anak (<12), Remaja (12-17), Pemuda (18-25), Young Pro (26-40), Dewasa (41-59), Lansia (60+).
  - Visual Badges: Color-coded tags on Member Cards and Profile.
- **MBTI Integration**:
  - Added MBTI field to Member Profile.
  - **AI Analysis**: One-click generation of "Personality Summary" using Gemini AI.
  - Visual MBTI Card with personality type display.
- **Data Seeder (Dev Tool)**:
  - "Secret Bunker" tool to seed random Birth Dates and MBTI types to test demographics.

### 🛠️ UX & Developer Experience
- **"Secret Bunker" Tools Page**: A dedicated Admin-only area for dangerous actions (Seeding, Cache Clearing).
- **Global Toast System**: Replaced alerts with beautiful, consistent `sonner` toasts (Top Center).
- **Date Standardization (Indonesia)**:
  - Global switch to `dd MMMM yyyy` (e.g., "14 Agustus 1945").
  - Updated standard for Dashboard, Event Details, and WhatsApp generator.
  - Hardened parsing logic to prevent Timezone off-by-one errors.
- **Global Localization Prep (i18n)**:
  - Database schema updated to support `locale` ('id-ID', 'en-US', 'en-AU').
  - Utility functions refactored for dynamic locale injection.

### 🔒 Security & Stability
- **Middleware Robustness**: Enhanced session refreshing and route protection.
- **Safe Actions**: Server Actions now include role checks before execution.
- **Hydration Fixes**: Solved React mismatch errors in Button and Layout.

---

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
