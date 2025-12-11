This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# Togather: Community Management PWA

**Togather** is a specialized Micro-SaaS designed to streamline the coordination of Church Cell Groups (Komsel). Built with a **Mobile-First** approach, it eliminates the chaos of WhatsApp scheduling by centralizing event dates and role assignments (Worship Leader, Prayer, etc.) in one seamless Progressive Web App.

![Project Status](https://img.shields.io/badge/Status-MVP_Ready-success)
![Tech Stack](https://img.shields.io/badge/Built_With-Next.js_15_%2B_Supabase-black)
![Methodology](https://img.shields.io/badge/Dev_Method-AI--Assisted_Vibecoding-purple)

## ⚡ The "12-Hour Build" Challenge

This project was built from scratch in **under 12 hours** as a case study in **"Vibecoding"** (AI-Augmented Development).

Instead of traditional hand-coding, I acted as the **Lead Architect & Product Manager**, orchestrating Large Language Models (Claude 3.5 Opus) to handle the implementation details while I focused on:
* **System Architecture:** Designing the Scalable DB Schema on Supabase.
* **Product Strategy:** Deciding on PWA over Native for zero-friction user adoption.
* **Problem Solving:** Handling edge cases in Auth and Rate Limiting.
* **UI/UX Direction:** Enforcing a centered mobile-native layout on desktop.

## 🛠 Tech Stack

* **Framework:** [Next.js 15](https://nextjs.org/) (App Router & Server Actions).
* **Language:** TypeScript.
* **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL + Magic Link Auth).
* **UI Library:** [Shadcn/UI](https://ui.shadcn.com/) + Tailwind CSS.
* **Icons:** Lucide React.
* **Deployment:** Vercel.

## ✨ Key Features (MVP)

* **Zero-Password Login:** Authentication via Email Magic Link (elderly-friendly).
* **Mobile-First Experience:** PWA-ready design that feels native on iOS/Android.
* **Event Dashboard:** Centralized view of upcoming meetings.
* **Role Management System:** CGL (Leaders) can create events and assign roles (WL, Prayer, etc.) to members.
* **Real-time Updates:** Powered by Next.js Server Actions and Supabase RLS.

## 🚀 How to Run Locally

1.  **Clone the repo**
    ```bash
    git clone [https://github.com/yourusername/togather.git](https://github.com/yourusername/togather.git)
    cd togather
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    Create a `.env.local` file and add your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
    NEXT_PUBLIC_SITE_URL=http://localhost:3000
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

## 🧠 Lessons Learned

* **PWA > Native:** For community apps, removing the "Install from PlayStore" barrier increases adoption significantly.
* **AI as a Force Multiplier:** Using AI allowed me to focus on high-level logic (Database Relations, RLS Policies) rather than spending hours on CSS centering or boilerplate code.
* **Constraints Breed Speed:** Killing features like "Recurring Events" and "In-app Chat" was crucial to shipping a functional MVP in 12 hours.

---
*Built with ❤️ and ☕ by [Nama Kamu / Username Github]*