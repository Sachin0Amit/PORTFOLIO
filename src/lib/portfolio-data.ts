/**
 * Central portfolio data for Sachin Kumar.
 * Alien-themed copy — frame each section as a cosmic transmission.
 */

export interface ProjectItem {
  title: string;
  codename: string;
  tagline: string;
  description: string;
  stack: string[];
  status: string;
  progress: number;
  accent: "alien" | "cyan" | "plasma";
  glyph: string;
  longDescription: string;
  features: string[];
  metrics: { label: string; value: string }[];
}

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
    { label: "GitHub", href: "https://github.com/Sachin0Amit", handle: "@Sachin0Amit" },
    { label: "LinkedIn", href: "#", handle: "in/sachinkumar" },
    { label: "Email", href: "mailto:sachinamit7144097@gmail.com", handle: "sachinamit7144097@gmail.com" },
  ],
  projects: [] as ProjectItem[],

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
      links: [
        { label: "LEETCODE", href: "https://leetcode.com/u/sachin0amit" },
        { label: "CODEFORCES", href: "https://codeforces.com/profile/DragoSachin" },
      ],
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
