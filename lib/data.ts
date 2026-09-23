export interface Skill {
  id: string;
  name: string;
  category: "Languages" | "Frontend" | "Backend" | "Database" | "Tools/DevOps" | "Soft Skills";
  iconName: string;
  level?: number;
  description?: string;
}

export const SKILL_CATEGORIES = [
  "All",
  "Languages",
  "Frontend",
  "Backend",
  "Database",
  "Tools/DevOps",
  "Soft Skills",
] as const;

export type SkillCategory = (typeof SKILL_CATEGORIES)[number];

export const SKILLS_DATA: Skill[] = [
  // Languages
  {
    id: "ts",
    name: "TypeScript",
    category: "Languages",
    iconName: "Code",
    level: 90,
    description: "Strong typing, interfaces, generics & async patterns",
  },
  {
    id: "js",
    name: "JavaScript (ES6+)",
    category: "Languages",
    iconName: "FileCode",
    level: 95,
    description: "DOM manipulation, promises, async/await, closures",
  },
  {
    id: "py",
    name: "Python",
    category: "Languages",
    iconName: "Terminal",
    level: 80,
    description: "Data processing, scripting & backend logic",
  },
  {
    id: "cpp",
    name: "C++",
    category: "Languages",
    iconName: "Cpu",
    level: 75,
    description: "OOP concepts, memory management & algorithms",
  },
  {
    id: "html-css",
    name: "HTML5 & CSS3",
    category: "Languages",
    iconName: "Layout",
    level: 95,
    description: "Semantic HTML, flexbox, grid, CSS variables",
  },

  // Frontend
  {
    id: "nextjs",
    name: "Next.js 14",
    category: "Frontend",
    iconName: "Globe",
    level: 90,
    description: "App Router, SSR, SSG, Server Actions, middleware",
  },
  {
    id: "react",
    name: "React.js",
    category: "Frontend",
    iconName: "Atom",
    level: 92,
    description: "Hooks, context, state management, custom hooks",
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    category: "Frontend",
    iconName: "Palette",
    level: 95,
    description: "Utility-first styling, design system tokens, dark mode",
  },
  {
    id: "framer",
    name: "Framer Motion",
    category: "Frontend",
    iconName: "Sparkles",
    level: 85,
    description: "Page transitions, gesture controls, layout animations",
  },

  // Backend
  {
    id: "nodejs",
    name: "Node.js",
    category: "Backend",
    iconName: "Server",
    level: 88,
    description: "Event-driven runtime, RESTful APIs, NPM modules",
  },
  {
    id: "express",
    name: "Express.js",
    category: "Backend",
    iconName: "Layers",
    level: 85,
    description: "Routing, middleware pipelines, error handling",
  },
  {
    id: "rest",
    name: "REST API Architecture",
    category: "Backend",
    iconName: "Network",
    level: 90,
    description: "API design, authentication, JSON schemas, CORS",
  },

  // Database
  {
    id: "supabase",
    name: "Supabase",
    category: "Database",
    iconName: "Database",
    level: 90,
    description: "Postgres database, Auth, Storage, RLS policies",
  },
  {
    id: "postgres",
    name: "PostgreSQL",
    category: "Database",
    iconName: "HardDrive",
    level: 82,
    description: "Relational modeling, SQL queries, indexing, joins",
  },
  {
    id: "mongodb",
    name: "MongoDB",
    category: "Database",
    iconName: "Boxes",
    level: 78,
    description: "NoSQL document stores, aggregation pipelines",
  },

  // Tools/DevOps
  {
    id: "git",
    name: "Git & GitHub",
    category: "Tools/DevOps",
    iconName: "GitBranch",
    level: 92,
    description: "Version control, branching, PR reviews, merge workflows",
  },
  {
    id: "docker",
    name: "Docker",
    category: "Tools/DevOps",
    iconName: "Container",
    level: 72,
    description: "Containerization, Dockerfiles, docker-compose",
  },
  {
    id: "vscode",
    name: "VS Code",
    category: "Tools/DevOps",
    iconName: "Laptop",
    level: 95,
    description: "Debugging, extensions, snippet workflows",
  },
  {
    id: "vercel",
    name: "Vercel & Deployment",
    category: "Tools/DevOps",
    iconName: "Cloud",
    level: 90,
    description: "CI/CD pipelines, environment variables, domains",
  },

  // Soft Skills
  {
    id: "problem-solving",
    name: "Problem Solving",
    category: "Soft Skills",
    iconName: "Brain",
    level: 95,
    description: "Analytical thinking, debugging mindset, root-cause resolution",
  },
  {
    id: "teamwork",
    name: "Team Collaboration",
    category: "Soft Skills",
    iconName: "Users",
    level: 90,
    description: "Pair programming, code reviews, clear communication",
  },
  {
    id: "agile",
    name: "Agile / Scrum",
    category: "Soft Skills",
    iconName: "CheckSquare",
    level: 85,
    description: "Iterative sprints, task prioritization, milestone delivery",
  },
];

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  duration: string;
  description: string;
  status: "Enrolled" | "Completed";
  courses?: string[];
}

export const EDUCATION_DATA: EducationItem[] = [
  {
    id: "bca",
    degree: "Bachelor of Computer Applications (BCA)",
    institution: "La Grande International College",
    location: "Pokhara, Nepal",
    duration: "2023 - Present",
    status: "Enrolled",
    description:
      "Comprehensive undergraduate degree program focused on Computer Science fundamentals, Software Engineering principles, Web Technologies, Database Management Systems, and Object-Oriented Programming.",
    courses: [
      "Data Structures & Algorithms",
      "Web Technology (HTML/CSS/JS)",
      "Database Management Systems (DBMS)",
      "Object-Oriented Programming (C++)",
      "Software Engineering & System Analysis",
      "Computer Networks",
    ],
  },
  {
    id: "plus-two",
    degree: "Higher Secondary Education (+2 Science / Computer Science)",
    institution: "Higher Secondary School",
    location: "Nepal",
    duration: "2021 - 2023",
    status: "Completed",
    description:
      "Specialized in Science & Computer Science curriculum, gaining strong foundational knowledge in Mathematics, Physics, C Programming, and Information Technology.",
    courses: [
      "Computer Science & C Programming",
      "Mathematics & Statistics",
      "Physics & Electronics Basics",
    ],
  },
  {
    id: "see",
    degree: "Secondary Education Examination (SEE)",
    institution: "Schooling / Secondary Academy",
    location: "Nepal",
    duration: "2021",
    status: "Completed",
    description:
      "Completed secondary education with distinction, demonstrating early passion and excellence in mathematics and computer applications.",
    courses: [
      "Computer Studies",
      "Opt. Mathematics",
      "General Science",
    ],
  },
];

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  duration: string;
  type: "Freelance" | "College Role" | "Project / Hackathon";
  bullets: string[];
  technologies: string[];
}

export const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    id: "freelance-dev",
    role: "Freelance Full-Stack Developer",
    company: "Self-Employed",
    location: "Remote / Nepal",
    duration: "2023 - Present",
    type: "Freelance",
    bullets: [
      "Architected and deployed custom web applications for client projects using Next.js 14, Tailwind CSS, and Supabase.",
      "Optimized site performance, SEO metadata, and dynamic content rendering, resulting in sub-second load times.",
      "Integrated secure authentication, database storage, and responsive UI layouts tailored to client specifications.",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "Vercel"],
  },
  {
    id: "tech-club-lead",
    role: "Lead Web Developer & Student Mentor",
    company: "La Grande IT & Tech Club",
    location: "Pokhara, Nepal",
    duration: "2023 - Present",
    type: "College Role",
    bullets: [
      "Spearheaded technical workshops and hands-on coding bootcamps for junior BCA students covering HTML, CSS, JavaScript, and Git.",
      "Led the development of internal club landing pages and event registration portals.",
      "Collaborated with peer developers to organize campus coding competitions and technical seminars.",
    ],
    technologies: ["JavaScript", "HTML5/CSS3", "Git", "GitHub", "Team Leadership"],
  },
  {
    id: "hackathon-lead",
    role: "Hackathon Team Lead & Developer",
    company: "National Tech Hackathon",
    location: "Nepal",
    duration: "2024",
    type: "Project / Hackathon",
    bullets: [
      "Designed and prototyped an interactive web application solving local community challenges within 48 hours.",
      "Coordinated backend API endpoints and frontend state management under tight time constraints.",
      "Presented the final product pitch to a panel of industry judges, securing top placement recognition.",
    ],
    technologies: ["React", "Node.js", "Express", "MongoDB", "Framer Motion"],
  },
];

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl: string;
  skills: string[];
  issuerColor?: string;
}

export const CERTIFICATIONS_DATA: CertificationItem[] = [
  {
    id: "meta-frontend",
    title: "Meta Front-End Developer Professional Certificate",
    issuer: "Meta (Coursera)",
    date: "2024",
    credentialUrl: "https://coursera.org",
    skills: ["React", "JavaScript", "HTML5/CSS3", "Version Control", "UX Design"],
    issuerColor: "from-blue-500 to-indigo-600",
  },
  {
    id: "freecodecamp-responsive",
    title: "Responsive Web Design Certification",
    issuer: "freeCodeCamp",
    date: "2023",
    credentialUrl: "https://freecodecamp.org",
    skills: ["HTML5", "CSS3", "Flexbox", "CSS Grid", "Accessibility"],
    issuerColor: "from-emerald-500 to-teal-600",
  },
  {
    id: "freecodecamp-js",
    title: "JavaScript Algorithms & Data Structures",
    issuer: "freeCodeCamp",
    date: "2023",
    credentialUrl: "https://freecodecamp.org",
    skills: ["ES6+", "OOP", "Functional Programming", "Algorithms"],
    issuerColor: "from-amber-500 to-yellow-600",
  },
  {
    id: "freecodecamp-backend",
    title: "Back End Development & APIs Certification",
    issuer: "freeCodeCamp",
    date: "2024",
    credentialUrl: "https://freecodecamp.org",
    skills: ["Node.js", "Express.js", "MongoDB", "Mongoose", "npm"],
    issuerColor: "from-purple-500 to-violet-600",
  },
];

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  github: string;
  demo?: string;
  category: "Web Apps" | "Full-Stack" | "Backend" | "Mini Projects";
  featured?: boolean;
}

export const PROJECT_CATEGORIES = [
  "All",
  "Full-Stack",
  "Web Apps",
  "Backend",
  "Mini Projects",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const PROJECTS_DATA: Project[] = [
  {
    id: "aura-analytics",
    title: "Aura Analytics — Enterprise SaaS Dashboard",
    description:
      "A full-stack analytics workspace featuring real-time data visualization, user cohort tracking, customizable dashboard widgets, and role-based access control.",
    tags: ["Next.js 14", "TypeScript", "Tailwind CSS", "Supabase", "Recharts", "Framer Motion"],
    image: "/images/projects/saas-dashboard.jpg",
    github: "https://github.com",
    demo: "https://aura-analytics.vercel.app",
    category: "Full-Stack",
    featured: true,
  },
  {
    id: "fluxflow-collaboration",
    title: "FluxFlow — Real-Time Team Collaboration Suite",
    description:
      "An interactive chat and workflow suite built with WebSocket integrations, rich file sharing, presence detection, and dark-mode glassmorphic interface design.",
    tags: ["React", "Node.js", "Express", "Socket.io", "MongoDB", "Tailwind CSS"],
    image: "/images/projects/chat-platform.jpg",
    github: "https://github.com",
    demo: "https://fluxflow-app.vercel.app",
    category: "Web Apps",
    featured: true,
  },
  {
    id: "neural-code-studio",
    title: "Neural Code Studio — AI Prompt & Code Studio",
    description:
      "An AI-assisted code generator and prompt engineering playground integrating LLM API endpoints with syntax highlighting and instant snippet export.",
    tags: ["Next.js 14", "TypeScript", "OpenAI API", "Tailwind CSS", "Prisma"],
    image: "/images/projects/ai-generator.jpg",
    github: "https://github.com",
    demo: "https://neural-studio.vercel.app",
    category: "Full-Stack",
    featured: true,
  },
  {
    id: "gateway-hub",
    title: "Gateway::Hub — Microservices API Gateway",
    description:
      "A high-throughput API gateway service with rate limiting, latency telemetry graphs, automatic request routing, and real-time status health checks.",
    tags: ["Node.js", "Express", "PostgreSQL", "Redis", "Docker", "REST API"],
    image: "/images/projects/api-gateway.jpg",
    github: "https://github.com",
    category: "Backend",
    featured: false,
  },
];
