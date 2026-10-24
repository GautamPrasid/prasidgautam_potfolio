export const SKILL_CATEGORIES = [
  "Languages",
  "Frontend",
  "Backend",
  "Database",
  "Tools/DevOps",
  "Soft Skills",
] as const;

export type SkillCategory = (typeof SKILL_CATEGORIES)[number];
export type SkillFilter = SkillCategory | "All";
export const SKILL_FILTERS = ["All", ...SKILL_CATEGORIES] as const;

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  iconName: string;
  level?: number;
  description?: string;
}

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

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl: string;
  skills: string[];
  issuerColor?: string;
}

export const PROJECT_CATEGORIES = [
  "Full-Stack",
  "Web Apps",
  "Backend",
  "Mini Projects",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];
export type ProjectFilter = ProjectCategory | "All";
export const PROJECT_FILTERS = ["All", ...PROJECT_CATEGORIES] as const;

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image?: string;
  github?: string;
  demo?: string;
  category: ProjectCategory;
  featured?: boolean;
}

export interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
  iconName: string;
  orderIndex: number;
}

export const BLOG_CATEGORIES = [
  "Web Development",
  "AI & Machine Learning",
  "Software Engineering",
  "Tutorials",
  "Career & Insights",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];
export type BlogFilter = BlogCategory | "All";
export const BLOG_FILTERS = ["All", ...BLOG_CATEGORIES] as const;

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: BlogCategory;
  tags: string[];
  readTime: string;
  published: boolean;
  publishedAt?: string;
}

export const DEFAULT_BLOGS: BlogPost[] = [
  {
    id: "blog-1",
    title: "Architecting Scalable Next.js 14 Web Applications: From App Router to Edge Runtime",
    slug: "architecting-scalable-nextjs-14-applications",
    excerpt:
      "A deep dive into Next.js App Router, Server Components, Streaming SSR, and Edge caching strategies to build lightning-fast web applications with zero layout shift.",
    content: `Building modern web applications requires a careful balance between user experience, developer productivity, and server performance. Next.js 14 and the React Server Components paradigm fundamentally changed how we structure frontend architecture.

### The Power of React Server Components (RSC)
React Server Components allow developers to render components on the server without shipping JavaScript bundles to the client. This drastically reduces the Time to Interactive (TTI) and First Contentful Paint (FCP).

Key advantages include:
- Zero-bundle-size dependencies: Heavy markdown parsers, date formatting libraries, or syntax highlighters stay on the server.
- Direct database and backend access: Query your Supabase database or internal microservices securely without exposing API keys.
- Automatic code splitting: Client components are only downloaded when needed.

### Streaming SSR with Suspense Boundaries
Instead of waiting for the slowest database query to finish before returning HTML, Next.js allows streaming chunks of UI as they become ready:
\`\`\`tsx
<Suspense fallback={<CardSkeleton />}>
  <RecentProjectsFeed />
</Suspense>
\`\`\`
This ensures the primary page structure is visible instantly, while data-heavy widgets hydrate asynchronously.

### Edge Caching & Revalidation Strategies
Using Incremental Static Regeneration (ISR) and on-demand cache tags (via \`revalidateTag\`), you can achieve static CDN delivery speeds with dynamic real-time freshness. Always consider the data mutability profile before picking between dynamic rendering and cached static generation.`,
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80",
    category: "Web Development",
    tags: ["Next.js", "React", "Architecture", "Performance"],
    readTime: "6 min read",
    published: true,
    publishedAt: "2024-03-24T00:00:00.000Z",
  },
  {
    id: "blog-2",
    title: "Demystifying Modern Machine Learning: A Practical Guide for Software Engineers",
    slug: "demystifying-modern-machine-learning-guide",
    excerpt:
      "Transitioning from traditional deterministic code to probabilistic AI models. Learn vector embeddings, RAG architectures, and fine-tuning fundamentals.",
    content: `Artificial intelligence and machine learning have moved from academic research labs into production codebases. For software engineers accustomed to deterministic algorithms, working with large language models and embeddings represents an exciting paradigm shift.

### From Deterministic Logic to Probabilistic Computing
Traditional programming follows strict rule-based logic: \`if condition then action\`. Machine learning, conversely, models mathematical probability distributions based on training data. Understanding loss functions, gradient descent, and token probability helps demystify why models succeed or hallucinate.

### Understanding Vector Embeddings & Similarity Search
Embeddings represent unstructured data (text, images, audio) as high-dimensional vectors in geometric space. Semantic closeness translates into vector proximity calculated via cosine similarity:
- Words with related meaning cluster together in vector space.
- Vector databases like pgvector or Pinecone allow sub-millisecond nearest neighbor queries.

### Building Reliable Retrieval-Augmented Generation (RAG)
RAG combines the creativity of LLMs with the factual accuracy of your private databases:
1. Ingestion: Chunk and vectorize documents into your database.
2. Retrieval: Match user queries against vector embeddings.
3. Augmentation: Inject retrieved context into the LLM system prompt.
4. Generation: Stream verifiable, citation-backed answers.

Adopting evaluation benchmarks like RAGAS ensures your AI pipeline maintains high precision and low hallucination rates in production.`,
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&auto=format&fit=crop&q=80",
    category: "AI & Machine Learning",
    tags: ["AI", "Machine Learning", "Embeddings", "RAG"],
    readTime: "7 min read",
    published: true,
    publishedAt: "2024-03-18T00:00:00.000Z",
  },
  {
    id: "blog-3",
    title: "Mastering TypeScript: Advanced Type Patterns & Real-World Clean Code",
    slug: "mastering-typescript-advanced-type-patterns",
    excerpt:
      "Unlock the full power of TypeScript's type system with conditional types, template literal types, branded primitives, and strict exhaustiveness checks.",
    content: `TypeScript is often used as a simple linter with basic interfaces, but its type system is a Turing-complete functional programming language in itself. Mastering advanced type patterns eliminates entire categories of runtime bugs before code ever ships to production.

### Discriminated Unions and Exhaustiveness
Discriminated unions are the single most effective tool for state management:
\`\`\`typescript
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: BlogPost[] }
  | { status: 'error'; error: Error };
\`\`\`
By checking \`state.status\`, TypeScript automatically narrows the type, preventing you from accessing \`data\` before it exists. Use an \`assertNever(val: never)\` helper in the switch statement default branch to guarantee compile-time exhaustiveness checks whenever a new status is added.

### Branded Primitives for Domain Safety
Primitives like strings and numbers can accidentally be mixed up (e.g., passing a \`UserId\` into an \`OrderId\` parameter). Branded types solve this:
\`\`\`typescript
type Brand<K, T> = K & { readonly __brand: T };
type UserId = Brand<string, 'UserId'>;
type OrderId = Brand<string, 'OrderId'>;
\`\`\`

### Conditional Types and Infer
Conditional types allow types to adapt based on conditions:
\`\`\`typescript
type Flatten<T> = T extends Array<infer Item> ? Item : T;
\`\`\`
Leveraging these patterns creates self-documenting APIs that guide developers with precise autocomplete hints.`,
    coverImage: "https://images.unsplash.com/photo-1516116211227-bbc14187210e?w=1200&auto=format&fit=crop&q=80",
    category: "Software Engineering",
    tags: ["TypeScript", "JavaScript", "Clean Code", "Design Patterns"],
    readTime: "5 min read",
    published: true,
    publishedAt: "2024-03-10T00:00:00.000Z",
  },
  {
    id: "blog-4",
    title: "The Art of System Design: Building High-Throughput Distributed Microservices",
    slug: "art-of-system-design-distributed-microservices",
    excerpt:
      "Essential patterns for resilient backend systems: rate limiting, circuit breakers, idempotency keys, and asynchronous message queues.",
    content: `Designing backend systems that reliably handle millions of requests requires defensive engineering. Single points of failure, unhandled network partitions, and cascading outages can bring down even well-provisioned clusters.

### Idempotency Keys for Safe Retries
In distributed systems, networks will fail. When an HTTP request to process a transaction drops before the response returns, the client must retry safely without double-charging or duplicating records. Implementing idempotency keys stored in Redis with atomic SETNX ensures that duplicate requests return the cached original response without re-executing business logic.

### Circuit Breakers & Graceful Degradation
When downstream services slow down, requests queue up and starve thread pools across upstream services. Circuit breaker libraries monitor failure rates:
- Closed: Normal operation, passing traffic.
- Open: Fail immediately with fallback data, giving the downstream service time to recover.
- Half-Open: Probe with limited traffic to verify recovery before resetting.

### Event-Driven Architecture with Message Queues
Decoupling long-running tasks (video encoding, analytics, email notifications) from synchronous request threads via Kafka or RabbitMQ prevents user-facing latency spikes and enables horizontal worker autoscaling.`,
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80",
    category: "Tutorials",
    tags: ["System Design", "Microservices", "Redis", "Backend"],
    readTime: "8 min read",
    published: true,
    publishedAt: "2024-02-28T00:00:00.000Z",
  },
  {
    id: "blog-5",
    title: "Building Interactive & Performant 3D Web Experiences with Three.js & WebGL",
    slug: "interactive-performant-3d-web-experiences",
    excerpt:
      "A hands-on guide to rendering real-time 3D models, shaders, particle systems, and buttery smooth canvas animations without killing battery life.",
    content: `Web browsers are now capable of rendering breathtaking real-time 3D graphics thanks to WebGL and WebGPU. But creating engaging 3D experiences that don't lag or drain user batteries requires a deep understanding of the GPU rendering pipeline.

### Scene Graph and Optimization Basics
Three.js structures 3D elements in a hierarchical scene graph. Every mesh has geometry and a material. Key performance optimization tips:
- Reduce Draw Calls: Group static geometries using \`BufferGeometryUtils.mergeGeometries\` or use instanced rendering (\`InstancedMesh\`) when rendering repeated items like particles or foliage.
- Optimize Texture Memory: Use compressed texture formats (KTX2 / Basis Universal) and power-of-two dimensions (512x512, 1024x1024) to enable GPU mipmapping.

### Custom Shaders with GLSL
While standard materials (MeshStandardMaterial) provide realistic PBR lighting, custom vertex and fragment shaders let you create mind-bending wave animations, liquid glass effects, and glowing cybernetic halos directly on the GPU at 60 FPS.

### Responsive Canvas & Device Pixel Ratio
Always clamp \`renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))\` — rendering at native 3x or 4x Retina resolution causes extreme fill-rate bottlenecks without noticeable visual improvement.`,
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
    category: "Web Development",
    tags: ["Three.js", "WebGL", "3D", "Frontend", "Creative Dev"],
    readTime: "6 min read",
    published: true,
    publishedAt: "2024-02-15T00:00:00.000Z",
  },
  {
    id: "blog-6",
    title: "From Junior to Senior: Navigating the Modern Software Engineering Career Path",
    slug: "navigating-software-engineering-career-growth",
    excerpt:
      "Lessons learned on writing maintainable code, technical communication, mentorship, pragmatic trade-offs, and cultivating continuous curiosity.",
    content: `The difference between a junior and senior engineer rarely comes down to typing speed or memorizing syntax. As you advance, your impact shifts from individual code output to amplifying team productivity, unblocking architectural decisions, and delivering reliable customer value.

### 1. Code is a Liability, Not an Asset
Junior engineers celebrate writing 500 lines of clever code. Senior engineers celebrate solving the problem by deleting 200 lines or leveraging an existing tested abstraction. Maintainable, boring code that is easy to read and debug at 2 AM always trumps clever magic.

### 2. Communication and Alignment
Writing RFCs (Request for Comments), documenting architecture design records (ADRs), and explaining trade-offs clearly to product managers and executives is the most undervalued skill in tech. Technical excellence is ineffective if the team cannot align on the roadmap.

### 3. Embrace Pragmatism Over Dogmatism
There are no silver bullets in software engineering — only trade-offs. Knowing when to choose a simple monolith over microservices, or when a quick script is better than an over-engineered framework, is the hallmark of technical maturity.`,
    coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80",
    category: "Career & Insights",
    tags: ["Career", "Mentorship", "Engineering", "Soft Skills"],
    readTime: "5 min read",
    published: true,
    publishedAt: "2024-01-28T00:00:00.000Z",
  },
];

