-- ===================================================
-- Portfolio — Seed Data (Supabase / PostgreSQL)
-- Run AFTER schema.sql. Each block only inserts when its table is empty,
-- so the file is safe to re-run without creating duplicates.
-- Projects and certifications are intentionally not seeded: add them
-- from /admin so real images and credential links are used.
-- ===================================================

-- Hero & About
INSERT INTO public.hero_about (name, roles, bio_text, about_text)
SELECT
    'Prasid Gautam',
    '["Full-Stack Developer", "BCA Student", "Problem Solver"]'::jsonb,
    'Passionate Full-Stack Developer and BCA student at La Grande International College. I craft modern, performant web applications with clean architecture and intuitive user experiences.',
    $about$Hello! I am Prasid Gautam, a passionate software developer currently pursuing my Bachelor of Computer Applications (BCA) at La Grande International College. My journey into tech started with a curiosity for how web platforms work behind the scenes. Over the years, that curiosity grew into a dedication to building scalable web applications, sleek user interfaces, and robust server architectures.$about$
WHERE NOT EXISTS (SELECT 1 FROM public.hero_about);

-- Skills
INSERT INTO public.skills (name, category, icon_name, level, description, order_index)
SELECT * FROM (VALUES
    ('TypeScript',            'Languages',    'Code',        90, 'Strong typing, interfaces, generics & async patterns', 1),
    ('JavaScript (ES6+)',     'Languages',    'FileCode',    95, 'DOM manipulation, promises, async/await, closures', 2),
    ('Python',                'Languages',    'Terminal',    80, 'Data processing, scripting & backend logic', 3),
    ('C++',                   'Languages',    'Cpu',         75, 'OOP concepts, memory management & algorithms', 4),
    ('HTML5 & CSS3',          'Languages',    'Layout',      95, 'Semantic HTML, flexbox, grid, CSS variables', 5),
    ('Next.js 14',            'Frontend',     'Globe',       90, 'App Router, SSR, SSG, Server Actions, middleware', 6),
    ('React.js',              'Frontend',     'Atom',        92, 'Hooks, context, state management, custom hooks', 7),
    ('Tailwind CSS',          'Frontend',     'Palette',     95, 'Utility-first styling, design system tokens, dark mode', 8),
    ('Framer Motion',         'Frontend',     'Sparkles',    85, 'Page transitions, gesture controls, layout animations', 9),
    ('Node.js',               'Backend',      'Server',      88, 'Event-driven runtime, RESTful APIs, NPM modules', 10),
    ('Express.js',            'Backend',      'Layers',      85, 'Routing, middleware pipelines, error handling', 11),
    ('REST API Architecture', 'Backend',      'Network',     90, 'API design, authentication, JSON schemas, CORS', 12),
    ('Supabase',              'Database',     'Database',    90, 'Postgres database, Auth, Storage, RLS policies', 13),
    ('PostgreSQL',            'Database',     'HardDrive',   82, 'Relational modeling, SQL queries, indexing, joins', 14),
    ('MongoDB',               'Database',     'Boxes',       78, 'NoSQL document stores, aggregation pipelines', 15),
    ('Git & GitHub',          'Tools/DevOps', 'GitBranch',   92, 'Version control, branching, PR reviews, merge workflows', 16),
    ('Docker',                'Tools/DevOps', 'Container',   72, 'Containerization, Dockerfiles, docker-compose', 17),
    ('VS Code',               'Tools/DevOps', 'Laptop',      95, 'Debugging, extensions, snippet workflows', 18),
    ('Vercel & Deployment',   'Tools/DevOps', 'Cloud',       90, 'CI/CD pipelines, environment variables, domains', 19),
    ('Problem Solving',       'Soft Skills',  'Brain',       95, 'Analytical thinking, debugging mindset, root-cause resolution', 20),
    ('Team Collaboration',    'Soft Skills',  'Users',       90, 'Pair programming, code reviews, clear communication', 21),
    ('Agile / Scrum',         'Soft Skills',  'CheckSquare', 85, 'Iterative sprints, task prioritization, milestone delivery', 22)
) AS v(name, category, icon_name, level, description, order_index)
WHERE NOT EXISTS (SELECT 1 FROM public.skills);

-- Education
INSERT INTO public.education (degree, institution, location, duration, status, description, courses, order_index)
SELECT * FROM (VALUES
    (
        'Bachelor of Computer Applications (BCA)',
        'La Grande International College',
        'Pokhara, Nepal',
        '2023 - Present',
        'Enrolled',
        'Undergraduate program focused on computer science fundamentals, software engineering, web technologies, database management systems, and object-oriented programming.',
        '["Data Structures & Algorithms", "Web Technology (HTML/CSS/JS)", "Database Management Systems (DBMS)", "Object-Oriented Programming (C++)", "Software Engineering & System Analysis", "Computer Networks"]'::jsonb,
        1
    )
) AS v(degree, institution, location, duration, status, description, courses, order_index)
WHERE NOT EXISTS (SELECT 1 FROM public.education);

-- Experience
INSERT INTO public.experience (role, company, location, duration, type, bullets, technologies, order_index)
SELECT * FROM (VALUES
    (
        'Freelance Full-Stack Developer',
        'Self-Employed',
        'Remote / Nepal',
        '2023 - Present',
        'Freelance',
        '["Built and deployed custom web applications for clients using Next.js, Tailwind CSS, and Supabase.", "Optimized site performance, SEO metadata, and dynamic content rendering.", "Integrated authentication, database storage, and responsive layouts tailored to client needs."]'::jsonb,
        '["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "Vercel"]'::jsonb,
        1
    ),
    (
        'Lead Web Developer & Student Mentor',
        'La Grande IT & Tech Club',
        'Pokhara, Nepal',
        '2023 - Present',
        'College Role',
        '["Ran technical workshops and coding bootcamps for junior BCA students covering HTML, CSS, JavaScript, and Git.", "Led development of internal club landing pages and event registration portals.", "Helped organize campus coding competitions and technical seminars."]'::jsonb,
        '["JavaScript", "HTML5/CSS3", "Git", "GitHub", "Team Leadership"]'::jsonb,
        2
    )
) AS v(role, company, location, duration, type, bullets, technologies, order_index)
WHERE NOT EXISTS (SELECT 1 FROM public.experience);