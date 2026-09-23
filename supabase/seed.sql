-- ===================================================
-- Supabase Database Seed Data Script
-- Populates tables with default portfolio data from lib/data.ts
-- Execute in Supabase SQL Editor: https://app.supabase.com
-- ===================================================

-- Seed Hero & About
INSERT INTO public.hero_about (id, name, roles, bio_text, about_text, stats)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Prasid Gautam',
  '["Full-Stack Developer", "BCA Student", "Problem Solver"]'::jsonb,
  'Passionate Full-Stack Developer and BCA student at La Grande International College. I craft modern, performant web applications with clean architecture and intuitive user experiences.',
  'Hello! I''m Prasid Gautam, a passionate software developer currently pursuing my Bachelor of Computer Applications (BCA) at La Grande International College. My journey into tech started with a curiosity for how web platforms work behind the scenes. Over the years, that curiosity grew into a dedication to building scalable web applications, sleek user interfaces, and robust server architectures.',
  '{"projects": 15, "certifications": 8, "technologies": 12}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Seed Skills
INSERT INTO public.skills (name, category, icon_name, level, description, order_index) VALUES
('TypeScript', 'Languages', 'Code', 90, 'Strong typing, interfaces, generics & async patterns', 1),
('JavaScript (ES6+)', 'Languages', 'FileCode', 95, 'DOM manipulation, promises, async/await, closures', 2),
('Python', 'Languages', 'Terminal', 80, 'Data processing, scripting & backend logic', 3),
('C++', 'Languages', 'Cpu', 75, 'OOP concepts, memory management & algorithms', 4),
('HTML5 & CSS3', 'Languages', 'Layout', 95, 'Semantic HTML, flexbox, grid, CSS variables', 5),

('Next.js 14', 'Frontend', 'Globe', 90, 'App Router, SSR, SSG, Server Actions, middleware', 6),
('React.js', 'Frontend', 'Atom', 92, 'Hooks, context, state management, custom hooks', 7),
('Tailwind CSS', 'Frontend', 'Palette', 95, 'Utility-first styling, design system tokens, dark mode', 8),
('Framer Motion', 'Frontend', 'Sparkles', 85, 'Page transitions, gesture controls, layout animations', 9),

('Node.js', 'Backend', 'Server', 88, 'Event-driven runtime, RESTful APIs, NPM modules', 10),
('Express.js', 'Backend', 'Layers', 85, 'Routing, middleware pipelines, error handling', 11),
('REST API Architecture', 'Backend', 'Network', 90, 'API design, authentication, JSON schemas, CORS', 12),

('Supabase', 'Database', 'Database', 90, 'Postgres database, Auth, Storage, RLS policies', 13),
('PostgreSQL', 'Database', 'HardDrive', 82, 'Relational modeling, SQL queries, indexing, joins', 14),
('MongoDB', 'Database', 'Boxes', 78, 'NoSQL document stores, aggregation pipelines', 15),

('Git & GitHub', 'Tools/DevOps', 'GitBranch', 92, 'Version control, branching, PR reviews, merge workflows', 16),
('Docker', 'Tools/DevOps', 'Container', 72, 'Containerization, Dockerfiles, docker-compose', 17),
('VS Code', 'Tools/DevOps', 'Laptop', 95, 'Debugging, extensions, snippet workflows', 18),
('Vercel & Deployment', 'Tools/DevOps', 'Cloud', 90, 'CI/CD pipelines, environment variables, domains', 19),

('Problem Solving', 'Soft Skills', 'Brain', 95, 'Analytical thinking, debugging mindset, root-cause resolution', 20),
('Team Collaboration', 'Soft Skills', 'Users', 90, 'Pair programming, code reviews, clear communication', 21),
('Agile / Scrum', 'Soft Skills', 'CheckSquare', 85, 'Iterative sprints, task prioritization, milestone delivery', 22);

-- Seed Education
INSERT INTO public.education (degree, institution, location, duration, status, description, courses, order_index) VALUES
(
  'Bachelor of Computer Applications (BCA)',
  'La Grande International College',
  'Pokhara, Nepal',
  '2023 - Present',
  'Enrolled',
  'Comprehensive undergraduate degree program focused on Computer Science fundamentals, Software Engineering principles, Web Technologies, Database Management Systems, and Object-Oriented Programming.',
  '["Data Structures & Algorithms", "Web Technology (HTML/CSS/JS)", "Database Management Systems (DBMS)", "Object-Oriented Programming (C++)", "Software Engineering & System Analysis", "Computer Networks"]'::jsonb,
  1
),
(
  'Higher Secondary Education (+2 Science / Computer Science)',
  'Higher Secondary School',
  'Nepal',
  '2021 - 2023',
  'Completed',
  'Specialized in Science & Computer Science curriculum, gaining strong foundational knowledge in Mathematics, Physics, C Programming, and Information Technology.',
  '["Computer Science & C Programming", "Mathematics & Statistics", "Physics & Electronics Basics"]'::jsonb,
  2
),
(
  'Secondary Education Examination (SEE)',
  'Schooling / Secondary Academy',
  'Nepal',
  '2021',
  'Completed',
  'Completed secondary education with distinction, demonstrating early passion and excellence in mathematics and computer applications.',
  '["Computer Studies", "Opt. Mathematics", "General Science"]'::jsonb,
  3
);

-- Seed Experience
INSERT INTO public.experience (role, company, location, duration, type, bullets, technologies, order_index) VALUES
(
  'Freelance Full-Stack Developer',
  'Self-Employed',
  'Remote / Nepal',
  '2023 - Present',
  'Freelance',
  '["Architected and deployed custom web applications for client projects using Next.js 14, Tailwind CSS, and Supabase.", "Optimized site performance, SEO metadata, and dynamic content rendering, resulting in sub-second load times.", "Integrated secure authentication, database storage, and responsive UI layouts tailored to client specifications."]'::jsonb,
  '["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "Vercel"]'::jsonb,
  1
),
(
  'Lead Web Developer & Student Mentor',
  'La Grande IT & Tech Club',
  'Pokhara, Nepal',
  '2023 - Present',
  'College Role',
  '["Spearheaded technical workshops and hands-on coding bootcamps for junior BCA students covering HTML, CSS, JavaScript, and Git.", "Led the development of internal club landing pages and event registration portals.", "Collaborated with peer developers to organize campus coding competitions and technical seminars."]'::jsonb,
  '["JavaScript", "HTML5/CSS3", "Git", "GitHub", "Team Leadership"]'::jsonb,
  2
),
(
  'Hackathon Team Lead & Developer',
  'National Tech Hackathon',
  'Nepal',
  '2024',
  'Project / Hackathon',
  '["Designed and prototyped an interactive web application solving local community challenges within 48 hours.", "Coordinated backend API endpoints and frontend state management under tight time constraints.", "Presented the final product pitch to a panel of industry judges, securing top placement recognition."]'::jsonb,
  '["React", "Node.js", "Express", "MongoDB", "Framer Motion"]'::jsonb,
  3
);

-- Seed Certifications
INSERT INTO public.certifications (title, issuer, date, credential_url, skills, issuer_color, order_index) VALUES
(
  'Meta Front-End Developer Professional Certificate',
  'Meta (Coursera)',
  '2024',
  'https://coursera.org',
  '["React", "JavaScript", "HTML5/CSS3", "Version Control", "UX Design"]'::jsonb,
  'from-blue-500 to-indigo-600',
  1
),
(
  'Responsive Web Design Certification',
  'freeCodeCamp',
  '2023',
  'https://freecodecamp.org',
  '["HTML5", "CSS3", "Flexbox", "CSS Grid", "Accessibility"]'::jsonb,
  'from-emerald-500 to-teal-600',
  2
),
(
  'JavaScript Algorithms & Data Structures',
  'freeCodeCamp',
  '2023',
  'https://freecodecamp.org',
  '["ES6+", "OOP", "Functional Programming", "Algorithms"]'::jsonb,
  'from-amber-500 to-yellow-600',
  3
),
(
  'Back End Development & APIs Certification',
  'freeCodeCamp',
  '2024',
  'https://freecodecamp.org',
  '["Node.js", "Express.js", "MongoDB", "Mongoose", "npm"]'::jsonb,
  'from-purple-500 to-violet-600',
  4
);

-- Seed Projects
INSERT INTO public.projects (title, description, tags, image, github, demo, category, featured, order_index) VALUES
(
  'Aura Analytics — Enterprise SaaS Dashboard',
  'A full-stack analytics workspace featuring real-time data visualization, user cohort tracking, customizable dashboard widgets, and role-based access control.',
  '["Next.js 14", "TypeScript", "Tailwind CSS", "Supabase", "Recharts", "Framer Motion"]'::jsonb,
  '/images/projects/saas-dashboard.jpg',
  'https://github.com',
  'https://aura-analytics.vercel.app',
  'Full-Stack',
  true,
  1
),
(
  'FluxFlow — Real-Time Team Collaboration Suite',
  'An interactive chat and workflow suite built with WebSocket integrations, rich file sharing, presence detection, and dark-mode glassmorphic interface design.',
  '["React", "Node.js", "Express", "Socket.io", "MongoDB", "Tailwind CSS"]'::jsonb,
  '/images/projects/chat-platform.jpg',
  'https://github.com',
  'https://fluxflow-app.vercel.app',
  'Web Apps',
  true,
  2
),
(
  'Neural Code Studio — AI Prompt & Code Studio',
  'An AI-assisted code generator and prompt engineering playground integrating LLM API endpoints with syntax highlighting and instant snippet export.',
  '["Next.js 14", "TypeScript", "OpenAI API", "Tailwind CSS", "Prisma"]'::jsonb,
  '/images/projects/ai-generator.jpg',
  'https://github.com',
  'https://neural-studio.vercel.app',
  'Full-Stack',
  true,
  3
),
(
  'Gateway::Hub — Microservices API Gateway',
  'A high-throughput API gateway service with rate limiting, latency telemetry graphs, automatic request routing, and real-time status health checks.',
  '["Node.js", "Express", "PostgreSQL", "Redis", "Docker", "REST API"]'::jsonb,
  '/images/projects/api-gateway.jpg',
  'https://github.com',
  NULL,
  'Backend',
  false,
  4
);
