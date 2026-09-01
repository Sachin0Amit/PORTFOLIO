/**
 * Central content source for Sachin Kumar's portfolio.
 * Keep this file free of React imports so any component can consume it.
 */

export const PERSONAL = {
  name: "Sachin Kumar",
  firstName: "Sachin",
  initials: "SK",
  role: "B.Tech CSE Student",
  tagline: "B.Tech CSE student learning to build good software, one day at a time.",
  college: "Government Engineering College, Sheikhpura",
  availability: "Open to internships & collaborations",
  heroRoles: [
    "B.Tech CSE Student",
    "Aspiring Software Engineer",
    "Web Development Learner",
    "Problem Solver",
    "Learning German & Japanese",
  ],
  heroIntro:
    "Second-year Computer Science & Engineering student at Government Engineering College, Sheikhpura. I enjoy building things for the web and improving a little every day.",
  bio: [
    "I'm Sachin Kumar, a second-year Computer Science and Engineering student at Government Engineering College, Sheikhpura. I did my Class 10 from New Era High School, Patna, and Class 12 from Manas Bhumi Senior Secondary School, Nalanda.",
    "Right now I'm focused on strengthening my fundamentals — data structures, algorithms, and web development. I scored 8.1 SGPA in my first semester and I'm working to keep improving. My goal is to become a good software engineer, and along the way I'm also learning German and Japanese.",
  ],
};

export const HERO_STATS = [
  { value: 8.1, decimals: 1, suffix: "", label: "Sem 1 SGPA" },
  { value: 2, decimals: 0, suffix: "nd", label: "Year of B.Tech" },
  { value: 3, decimals: 0, suffix: "", label: "Schools Attended" },
  { value: 2, decimals: 0, suffix: "", label: "New Languages" },
];

export const EDUCATION = [
  {
    level: "Class X",
    school: "New Era High School",
    place: "Patna, Bihar",
    period: "Secondary School",
    description:
      "Where my interest in mathematics and science began — the starting point of everything that followed.",
    tags: ["Class 10", "Patna"],
    icon: "School",
    accent: "violet" as const,
  },
  {
    level: "Class XII",
    school: "Manas Bhumi Senior Secondary School",
    place: "Nalanda, Bihar",
    period: "Senior Secondary",
    description:
      "Completed my senior secondary education in Nalanda — a place known for its long history of learning.",
    tags: ["Class 12", "Nalanda"],
    icon: "BookOpen",
    accent: "fuchsia" as const,
  },
  {
    level: "B.Tech CSE",
    school: "Government Engineering College",
    place: "Sheikhpura, Bihar",
    period: "2024 — Present",
    description:
      "Second-year Computer Science and Engineering. First semester SGPA: 8.1 / 10.",
    tags: ["Computer Science", "SGPA 8.1", "2nd Year"],
    icon: "GraduationCap",
    accent: "amber" as const,
  },
];

export interface SkillItem {
  name: string;
  level: number; // 0-100, self-assessed progress
}

export const SKILL_CATEGORIES = [
  {
    id: "languages",
    title: "Programming Languages",
    subtitle: "The languages I write",
    icon: "Code2",
    skills: [
      { name: "C", level: 82 },
      { name: "C++", level: 76 },
      { name: "Python", level: 72 },
      { name: "JavaScript", level: 70 },
      { name: "Java", level: 64 },
      { name: "TypeScript", level: 54 },
    ] as SkillItem[],
  },
  {
    id: "web",
    title: "Web Development",
    subtitle: "What I use to build",
    icon: "Globe",
    skills: [
      { name: "HTML & CSS", level: 86 },
      { name: "Tailwind CSS", level: 72 },
      { name: "React", level: 66 },
      { name: "Next.js", level: 60 },
      { name: "Node.js", level: 46 },
      { name: "Three.js / WebGL", level: 42 },
    ] as SkillItem[],
  },
  {
    id: "tools",
    title: "Tools & Others",
    subtitle: "My everyday toolkit",
    icon: "Wrench",
    skills: [
      { name: "Git & GitHub", level: 76 },
      { name: "VS Code", level: 90 },
      { name: "Linux", level: 58 },
      { name: "Figma", level: 52 },
      { name: "Problem Solving", level: 74 },
      { name: "DSA", level: 62 },
    ] as SkillItem[],
  },
];

export const CURRENTLY_LEARNING = [
  "Data Structures & Algorithms",
  "Web Development Projects",
  "German — A1",
  "Japanese — N5",
];


export const PROJECTS = [
  {
    title: "My Portfolio",
    subtitle: "This website",
    description:
      "A portfolio website built with Next.js, Tailwind CSS and Framer Motion — designed and coded from scratch.",
    image: "/portfolio/project-1.png",
    tech: ["Next.js", "TypeScript", "Tailwind", "Framer Motion"],
    category: "Web",
    highlight: "You are here",
  },
  {
    title: "Neural Visions",
    subtitle: "AI / ML exploration",
    description:
      "A conceptual exploration of machine learning — visualizing neural networks as systems of data and light.",
    image: "/portfolio/project-2.png",
    tech: ["Python", "ML Concepts", "Data Viz"],
    category: "Machine Learning",
    highlight: "Concept",
  },
  {
    title: "Digital Nalanda",
    subtitle: "Heritage meets technology",
    description:
      "A concept project reimagining the ancient Nalanda university as a digital campus — connecting history with technology.",
    image: "/portfolio/project-3.png",
    tech: ["3D Design", "Storytelling", "Web"],
    category: "Creative Tech",
    highlight: "Concept",
  },
];

export const NAV_LINKS = [
  { id: "about", label: "About" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "guestbook", label: "Guestbook" },
  { id: "contact", label: "Contact" },
];

export const SECTION_HEADING_NUMBERS: Record<string, string> = {
  about: "01",
  education: "02",
  skills: "03",
  projects: "04",
  guestbook: "05",
  contact: "06",
};
