export interface CaseStudyDetail {
  problem: string;
  contribution: string;
  architecture: string;
  keyFeatures: string[];
  deliverables?: string[];
  statusNote?: string;
}

export const CASE_STUDIES: Record<string, CaseStudyDetail> = {
  "studybuddy": {
    problem:
      "College students often juggle multiple disjointed tools for notes, class resources, questions, and task tracking, leading to fragmented academic workflows and missed deadlines.",
    contribution:
      "Architected and engineered a comprehensive desktop application from scratch using the Model-View-Controller (MVC) pattern. Designed the relational database schema in Microsoft SQL Server, implemented secure authentication, JDBC database abstraction, and modular FXML UI views with custom CSS styling.",
    architecture: "Desktop MVC (Model-View-Controller) with JavaFX, FXML, and JDBC on Microsoft SQL Server",
    keyFeatures: [
      "Student authentication & profile management with credential encryption",
      "Notes repository with search, categorization, and offline access",
      "Resource upload and download system for academic materials",
      "Interactive Q&A forum for peer discussion and knowledge sharing",
      "Task planner with priority tags, deadlines, and completion tracking",
      "Administrative moderation panel for managing user accounts and flagging content",
    ],
    deliverables: ["Compiled Maven Package", "SQL Server Schema Scripts", "FXML Layout Templates"],
    statusNote: "Desktop application with active source repository and SQL Server persistence.",
  },
  "portfolio": {
    problem:
      "Developers need a modern, high-performance portfolio that reflects production engineering standards, dynamic CMS capabilities, and zero hardcoded content.",
    contribution:
      "Built a full-stack Next.js App Router application with Supabase integration. Designed Row-Level Security policies, incremental static regeneration (ISR), Edge-verified rate limiting, and an authenticated administrative dashboard.",
    architecture: "Next.js 14 App Router, Server Actions, Tailwind CSS, Supabase PostgreSQL, and ISR",
    keyFeatures: [
      "Dynamic data-driven portfolio with Supabase database as the single source of truth",
      "Authenticated CMS panel at /admin for managing all portfolio sections",
      "Multi-layer contact form protection with L1/L2 rate limiting and edge IP resolution",
      "Server-side pre-rendered blog articles with ISR and database-driven OpenGraph previews",
      "Dark and light mode with system preference detection and zero-flash persistence",
    ],
    statusNote: "Deployed live on Vercel with automated continuous delivery and Supabase backend.",
  },
  "voting": {
    problem:
      "Traditional paper and basic digital voting mechanisms lack auditable security, transparent administrative control, and tamper-resistant authentication.",
    contribution:
      "Developed a secure electronic voting management system in JavaFX. Implemented BCrypt password hashing for secure authentication, relational voter tracking in MySQL, and strict vote-tally integrity checks.",
    architecture: "Layered Desktop Architecture with JavaFX and MySQL using BCrypt Cryptographic Hashing",
    keyFeatures: [
      "Secure voter registration and one-person-one-vote enforcement",
      "BCrypt password hashing for voter and administrator credentials",
      "Real-time election tallying and graphical result dashboards",
      "Administrative election configuration, candidate registration, and ballot locking",
    ],
    statusNote: "Academic project demonstrating cryptographic hashing and transactional database management.",
  },
  "student-management": {
    problem:
      "Institutions require lightweight, efficient data structures to manage student records, grades, and enrollments without heavy overhead.",
    contribution:
      "Implemented a structured console application in C utilizing file handling, dynamic structures, and search algorithms for student record operations.",
    architecture: "Modular C application with binary file persistence and structured data models",
    keyFeatures: [
      "Student record creation, modification, and deletion with input validation",
      "Binary file storage for persistent offline record retention",
      "Search by roll number or student name with sorting algorithms",
      "Grade calculation and formatted tabular report generation",
    ],
    statusNote: "First-year computer science project demonstrating memory management and file I/O in C.",
  },
  "pacman": {
    problem:
      "Recreating real-time arcade game loops in a terminal environment requires precise coordinate updates, collision detection, and ghost AI heuristics.",
    contribution:
      "Engineered a retro Pac-Man game in C using standard terminal manipulation, custom matrix-based maze representations, and file-based high score tracking.",
    architecture: "Tick-based Game Loop in C with Coordinate Matrix Collision Detection",
    keyFeatures: [
      "2D grid-based maze parsing with pellet and power-up tracking",
      "Ghost tracking logic simulating classic arcade pursuit behaviors",
      "Collision detection and multi-life management system",
      "Persistent high-score board saved via C file handling",
    ],
    statusNote: "Interactive console game project focused on procedural programming and game logic.",
  },
};

export function getCaseStudyForProject(title: string, category?: string): CaseStudyDetail {
  const lower = title.toLowerCase();
  if (lower.includes("studybuddy") || lower.includes("student companion")) {
    return CASE_STUDIES["studybuddy"];
  }
  if (lower.includes("portfolio")) {
    return CASE_STUDIES["portfolio"];
  }
  if (lower.includes("voting")) {
    return CASE_STUDIES["voting"];
  }
  if (lower.includes("student management")) {
    return CASE_STUDIES["student-management"];
  }
  if (lower.includes("pacman") || lower.includes("pac-man")) {
    return CASE_STUDIES["pacman"];
  }

  // Generative fallback based on title and category
  return {
    problem: `Designed to address practical challenges in ${category || "software development"} through an optimized, maintainable technical implementation.`,
    contribution:
      "Engineered application logic, structured the component and data architecture, and built responsive user interactions.",
    architecture: `${category || "Full-Stack"} Application Architecture with modular component design`,
    keyFeatures: [
      "Core application workflows with robust error boundaries",
      "Optimized data flow and clean separation of concerns",
      "Structured codebase designed for extensibility and reliability",
    ],
    statusNote: "Implemented and documented with source repository access.",
  };
}
