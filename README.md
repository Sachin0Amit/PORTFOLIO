<div align="center">

# 🚀 Sachin Kumar // Cosmic Engineer Portfolio

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.js.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite)](https://www.sqlite.org/)

<p align="center">
  <b>A futuristic, sci-fi & alien-themed developer portfolio built with Next.js 16, React 19, Tailwind CSS, Framer Motion, and Prisma.</b>
</p>

[Live Demo](#) · [Report Bug](https://github.com/Sachin0Amit/PORTFOLIO/issues) · [Request Feature](https://github.com/Sachin0Amit/PORTFOLIO/issues)

</div>

---

## 🌌 Overview

Welcome to the **Cosmic Engineer Portfolio** — an immersive, sci-fi inspired developer interface crafted for **Sachin Kumar**, a Computer Science & Engineering student at Government Engineering College, Sheikhpura.

The portfolio is designed as an interplanetary engineering terminal featuring responsive holographic HUD components, interactive Canvas particle starfields, real-time coding platform uplinks, audio feedback synthesized with the Web Audio API, and persistent database-backed transmission channels.

---

## ✨ Features

- **🛸 Sci-Fi & Cosmic Aesthetic**
  - Interactive HTML5 Canvas particle starfield with depth and motion parallax.
  - Custom Alien cursor with reactive springs and inertia.
  - Futuristic HUD brackets, scanlines, and glow indicators.
  - Ambient Web Audio sound system with interactive sound bindings and toggle.
  - Secret **Konami Code** easter egg (`↑ ↑ ↓ ↓ ← → ← → B A`).

- **📡 Live Coding Uplinks (Platform Telemetry)**
  - Real-time public API statistics integration for **LeetCode**, **Codeforces**, and **GitHub**.
  - **LeetCode Uplink**: Total solved, difficulty breakdown, skill tags, and 52-week activity heatmap.
  - **Codeforces Uplink**: Current rating, tier badges, peak marker, and animated rating trajectory chart.
  - **GitHub Uplink**: Public repositories, stars tally, follower counts, and 1-year contribution grid.
  - In-memory caching layer with automatic 10-minute synchronization and manual resync button.

- **📊 Mission-Control Academic Telemetry**
  - Hand-crafted SVG speedometer gauge visualizing SGPA (8.1 / 10.0).
  - 8-semester B.Tech CSE trajectory tracker with animated status stripes.
  - Traveling dual EKG oscilloscope waveform with system status monitoring.

- **📬 Transmissions & Testimonials**
  - **Sub-Space Transmission Form**: Full contact form with client and server-side validation, rate limiting, and persistent storage via SQLite & Prisma.
  - **Visitor Testimonial System**: Interactive endorsements module allowing visitors to submit messages and reviews.

- **⌨️ Keyboard Navigation & Accessibility**
  - Quick launcher command palette via `Ctrl + K` or `Cmd + K`.
  - Shortcuts help overlay triggered via `?`.
  - Back-to-top floating propulsion trigger with scroll progress indicator.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) |
| **UI Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + Custom Design Tokens |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Components** | [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Database & ORM** | [SQLite](https://www.sqlite.org/) + [Prisma ORM](https://www.prisma.io/) |
| **Audio** | Web Audio API (zero external sound assets needed) |

---

## 📁 Project Structure

```text
portfolio/
├── db/                         # Local SQLite database
│   └── custom.db
├── prisma/                     # Prisma schema and ORM configurations
│   └── schema.prisma
├── public/                     # Static assets (images, badges, logos)
│   ├── assets/                 # Curated sci-fi graphics & certificates
│   ├── logo.svg
│   └── robots.txt
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes (/contact, /platforms, /testimonials)
│   │   ├── globals.css         # Cosmic theme, HUD scanlines, & keyframes
│   │   ├── layout.tsx          # Root layout with fonts & metadata
│   │   └── page.tsx            # Main portfolio orchestrator
│   ├── components/
│   │   ├── effects/            # Starfield, Cursor, Sound, Command Palette, etc.
│   │   ├── portfolio/          # Hero, About, Education, Skills, Platforms, etc.
│   │   └── ui/                 # Reusable Radix & shadcn/ui components
│   ├── hooks/                  # Custom React hooks (sound, tilt, mobile, toast)
│   └── lib/                    # Utilities, DB client, platform stats fetchers, rate limiting
├── .env.example                # Example environment configuration
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have one of the following installed:
- **Node.js**: `v20.x` or later
- **Package Manager**: `npm`, `pnpm`, or `bun`

### Installation

1. **Clone the repository:**
   ```bash
   git clone git@github.com:Sachin0Amit/PORTFOLIO.git
   cd PORTFOLIO
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up Environment Variables:**
   ```bash
   cp .env.example .env
   ```

4. **Initialize the Database:**
   ```bash
   npx prisma db push
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   # or
   bun dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the portfolio.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Runs the application in development mode with Turbopack |
| `npm run build` | Builds the application for production deployment |
| `npm run start` | Runs the built production application |
| `npm run lint` | Runs ESLint to check code quality |
| `npm run type-check` | Runs TypeScript compiler to verify types |
| `npm run db:push` | Pushes the Prisma schema to the SQLite database |
| `npm run db:generate` | Generates the Prisma client |

---

## 👤 Author

**Sachin Kumar**
- **Institution**: Government Engineering College, Sheikhpura (B.Tech CSE)
- **GitHub**: [@Sachin0Amit](https://github.com/Sachin0Amit)
- **LeetCode**: [@sachin0amit](https://leetcode.com/u/sachin0amit)
- **Codeforces**: [@DragoSachin](https://codeforces.com/profile/DragoSachin)
- **Email**: [sachinamit7144097@gmail.com](mailto:sachinamit7144097@gmail.com)

---

## 📄 License

This project is licensed under the MIT License - feel free to use it for personal inspiration!
