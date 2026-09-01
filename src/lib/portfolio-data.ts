/**
 * Central portfolio data for Sachin Kumar.
 * Alien-themed copy — frame each section as a cosmic transmission.
 */

export const PROFILE = {
  name: "Sachin Kumar",
  callsign: "COSMIC.ENGINEER",
  origin: "Bihar, India",
  originCodename: "SECTOR-INDIA-EAST",
  tagline: "Traversing the universe of code, languages & alien tech.",
  status: "ONLINE",
  bio: [
    "I am Sachin Kumar — a human-origin carbon unit spawned in the biosphere of Bihar, India. Currently docked at Government Engineering College, Sheikhpura, decoding the CSE curriculum while reverse-engineering the cosmos one commit at a time.",
    "My mission: evolve into a senior software engineer, absorb the linguistic frequencies of German and Japanese, and one day beam my code across galaxies.",
  ],
  education: [
    {
      phase: "ORIGIN.SEED",
      title: "10th Standard",
      place: "New Era High School, Patna",
      location: "Patna, Bihar",
      period: "Foundation Phase",
      detail:
        "First contact with structured knowledge. Mathematics and science ignited the curiosity drive that would later power my engineering journey.",
      glyph: "01",
    },
    {
      phase: "ASCENSION",
      title: "12th Standard",
      place: "Manas Bhumi Senior Secondary School",
      location: "Nalanda, Bihar",
      period: "Trajectory Phase",
      detail:
        "Sharpened analytical cores in the land of ancient Nalanda University. Physics and mathematics calibrated the launch vector toward Computer Science.",
      glyph: "02",
    },
    {
      phase: "STELLAR.DOCK",
      title: "B.Tech in CSE — 2nd Year",
      place: "Government Engineering College, Sheikhpura",
      location: "Sheikhpura, Bihar",
      period: "Current Orbit",
      detail:
        "Orbiting the Computer Science & Engineering star-system. First-semester telemetry recorded an 8.1 SGPA — engines nominal, trajectory stable.",
      glyph: "03",
    },
  ],
  performance: {
    sgpa: 8.1,
    semester: "Semester 1",
    label: "First Semester Telemetry",
    note: "Engines nominal. Trajectory stable for higher orbits.",
    breakdown: [
      { label: "Grade Weight", value: 81, color: "alien" },
      { label: "Remaining Headroom", value: 19, color: "plasma" },
    ],
  },
  skills: [
    {
      category: "Core Engineering",
      items: [
        { name: "C / C++", level: 72 },
        { name: "Python", level: 65 },
        { name: "Data Structures", level: 68 },
        { name: "OOP", level: 70 },
      ],
    },
    {
      category: "Web & Tools",
      items: [
        { name: "HTML / CSS", level: 78 },
        { name: "JavaScript", level: 60 },
        { name: "Git", level: 55 },
        { name: "Linux", level: 50 },
      ],
    },
    {
      category: "In Transit",
      items: [
        { name: "React / Next.js", level: 45 },
        { name: "Databases", level: 40 },
        { name: "Problem Solving", level: 75 },
        { name: "Algorithms", level: 62 },
      ],
    },
  ],
  goals: [
    {
      title: "Become a Software Engineer",
      codename: "MISSION.ENGINEER",
      description:
        "Evolve into a production-grade software engineer capable of architecting systems that scale across continents and, one day, star systems.",
      progress: 38,
      eta: "In Progress",
    },
    {
      title: "Learn German",
      codename: "FREQ.DEUTSCH",
      description:
        "Tune my neural net to the German linguistic frequency — the language of engineers, philosophers, and precision machinery.",
      progress: 12,
      eta: "Acquiring",
    },
    {
      title: "Learn Japanese",
      codename: "FREQ.NIHONGO",
      description:
        "Sync with the Japanese linguistic protocol — the tongue of craft, minimalism, and relentless improvement (kaizen).",
      progress: 8,
      eta: "Acquiring",
    },
  ],
  stats: [
    { label: "SGPA", value: "8.1", unit: "/10" },
    { label: "Year", value: "2nd", unit: "BTech" },
    { label: "Languages", value: "3", unit: "target" },
    { label: "Origin", value: "BIHAR", unit: "IND" },
  ],
  socials: [
    { label: "GitHub", href: "#", handle: "@sachinkumar" },
    { label: "LinkedIn", href: "#", handle: "in/sachinkumar" },
    { label: "Email", href: "mailto:sachinamit7144097@gmail.com", handle: "sachinamit7144097@gmail.com" },
  ],
  projects: [
    {
      title: "Stellar Chat Relay",
      codename: "PROJ.NEBULA-01",
      tagline: "Real-time chat across the void",
      description:
        "A low-latency messaging relay built with WebSockets. Encrypted channels, presence detection and message history — engineered to feel instantaneous even across continents.",
      stack: ["Next.js", "Socket.IO", "TypeScript", "Tailwind"],
      status: "ORBITAL",
      progress: 72,
      accent: "alien",
      glyph: "01",
      longDescription:
        "Stellar Chat Relay is a full-duplex messaging system designed to feel instantaneous across continents. The transport layer runs over WebSocket with a custom binary protocol that packs presence + message frames together to cut overhead. A Redis-backed fan-out ensures group channels scale without re-broadcasting to every socket. The frontend uses optimistic UI with conflict resolution, so typing indicators and delivery receipts feel native.",
      features: [
        "End-to-end encrypted direct channels",
        "Real-time presence & typing indicators",
        "Optimistic UI with conflict resolution",
        "Message history with infinite scroll",
        "Redis-backed fan-out for group channels",
      ],
      metrics: [
        { label: "Latency", value: "< 80ms" },
        { label: "Concurrent", value: "1k+" },
        { label: "Uptime", value: "99.9%" },
      ],
    },
    {
      title: "Alien Glyph Cipher",
      codename: "PROJ.CIPHER-02",
      tagline: "Encode secrets in an alien tongue",
      description:
        "A Caesar-derived substitution cipher playground that encodes English into a custom alien glyph script. Includes frequency analysis tools for cracking the code.",
      stack: ["React", "JavaScript", "Web Crypto"],
      status: "ACTIVE",
      progress: 90,
      accent: "cyan",
      glyph: "02",
      longDescription:
        "Alien Glyph Cipher is a cryptography playground that maps the Latin alphabet onto a custom extraterrestrial glyph script. Beyond simple substitution, it ships a Vigenère mode, a frequency-analysis cracker that visualises letter distributions, and a live decoder ring. The glyph font is hand-drawn as SVG paths so every character scales crisply at any size.",
      features: [
        "Substitution + Vigenère cipher modes",
        "Live frequency-analysis cracker",
        "Hand-drawn SVG alien glyph font",
        "Copy-to-clipboard encoded output",
        "Decoder ring with drag-to-align",
      ],
      metrics: [
        { label: "Glyphs", value: "26" },
        { label: "Modes", value: "3" },
        { label: "Size", value: "12kb" },
      ],
    },
    {
      title: "Cosmic Weather Station",
      codename: "PROJ.METEO-03",
      tagline: "Telemetry from any coordinate",
      description:
        "Aggregates open weather APIs into a single sci-fi dashboard with animated radial gauges, 7-day forecasts and severe-weather alerts. Inspired by mission-control HUDs.",
      stack: ["React", "Recharts", "REST APIs"],
      status: "ACTIVE",
      progress: 65,
      accent: "plasma",
      glyph: "03",
      longDescription:
        "Cosmic Weather Station renders live meteorological telemetry as a mission-control HUD. It federates multiple open weather APIs, normalises them into a single schema, and pushes the result through animated radial gauges, sparkline trends and a 7-day forecast strip. Severe-weather alerts trigger a pulsing plasma overlay so you never miss a storm front.",
      features: [
        "Multi-source weather API federation",
        "Animated radial gauges (Recharts)",
        "7-day forecast strip",
        "Severe-weather plasma alerts",
        "Geolocation auto-detect",
      ],
      metrics: [
        { label: "Sources", value: "4" },
        { label: "Forecast", value: "7-day" },
        { label: "Refresh", value: "60s" },
      ],
    },
    {
      title: "Bihar Heritage Atlas",
      codename: "PROJ.ATLAS-04",
      tagline: "Mapping my home sector",
      description:
        "An interactive map of historical sites across Bihar — from Nalanda to Bodh Gaya — with rich media, geolocation and offline support. A tribute to my origin.",
      stack: ["Next.js", "Mapbox", "Prisma"],
      status: "BUILDING",
      progress: 40,
      accent: "alien",
      glyph: "04",
      longDescription:
        "Bihar Heritage Atlas is an interactive map of historical sites across my home state — from the ruins of Nalanda University to the Bodhi Tree at Bodh Gaya. Each pin opens a rich-media card with historical context, photos and audio snippets. A service-worker caches the entire atlas so it works offline, which matters for areas with patchy connectivity.",
      features: [
        "Interactive Mapbox map of Bihar",
        "Rich-media pin cards (photo + audio)",
        "Offline-first service worker cache",
        "Geolocation 'nearest site' routing",
        "Admin CMS for adding new sites",
      ],
      metrics: [
        { label: "Sites", value: "60+" },
        { label: "Offline", value: "100%" },
        { label: "Districts", value: "38" },
      ],
    },
  ],
  achievements: [
    {
      title: "Distinction SGPA",
      value: "8.1",
      detail: "First semester, CSE",
      icon: "gauge",
      accent: "alien",
    },
    {
      title: "CSE Sophomore",
      value: "Y2",
      detail: "Government Eng. College, Sheikhpura",
      icon: "graduation",
      accent: "cyan",
    },
    {
      title: "Polyglot Cadet",
      value: "3",
      detail: "Target: EN · DE · JP",
      icon: "languages",
      accent: "plasma",
    },
    {
      title: "Open Source Initiate",
      value: "∞",
      detail: "First PRs shipped",
      icon: "git",
      accent: "alien",
    },
    {
      title: "Problem Solver",
      value: "200+",
      detail: "DSA problems cleared",
      icon: "cpu",
      accent: "cyan",
    },
    {
      title: "Bihar Origin",
      value: "IND",
      detail: "Sector: Earth · East",
      icon: "map",
      accent: "plasma",
    },
  ],
  nowPlaying: {
    learning: "Data Structures & Algorithms",
    building: "Alien-themed portfolio v2",
    reading: "Clean Code — Robert C. Martin",
    listening: "Synthwave / Lo-fi space ambient",
    location: "Sheikhpura, Bihar",
    mood: "Hyper-focused",
  },
  // Preview image paths per project codename
  projectImages: {
    "PROJ.NEBULA-01": "/assets/proj-chat.png",
    "PROJ.CIPHER-02": "/assets/proj-cipher.png",
    "PROJ.METEO-03": "/assets/proj-weather.png",
    "PROJ.ATLAS-04": "/assets/proj-atlas.png",
  } as Record<string, string>,
  // Testimonials are now live — fetched from /api/testimonials (Prisma).
  // Visitors submit their own via the form in the Testimonials section.
  certificates: [
    {
      title: "Full Stack Web Development Program",
      issuer: "TechBairn",
      issuerTagline: "Let's accelerate the future",
      certId: "TB2601020030",
      issueDate: "24 Aug 2026",
      duration: "11 Jan 2026 – 23 Jun 2026",
      trainer: "Mr. Rakesh Deka",
      verifyEmail: "info@techbairn.com",
      image: "/assets/cert-techbairn-fullstack.jpg",
      skills: [
        "HTML", "CSS", "JavaScript", "React", "Node.js",
        "Express", "MongoDB", "REST APIs", "Git", "Deployment",
      ],
      accent: "alien",
      codename: "CERT.FULLSTACK-01",
    },
  ],
};

export type Profile = typeof PROFILE;
