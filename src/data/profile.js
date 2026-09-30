// Single source of truth for site copy. Facts come from the resume
// (public/Resume/Livingstone_Rwagatare_Resume.pdf) — keep them in sync.

export const profile = {
    name: 'Livingstone Rwagatare',
    role: 'Software Engineer',
    location: 'Boston, MA',
    email: 'lrwagatare@gmail.com',
    resume: '/Resume/Livingstone_Rwagatare_Resume.pdf',
    photo: '/Photos/profile-720.jpg',
    links: {
        github: 'https://github.com/Rwagatare',
        linkedin: 'https://www.linkedin.com/in/rwagatare-livingstone',
    },
    now: { label: 'Co-founder, Rivetfields', href: 'https://rivetfields.com' },
};

export const experience = [
    {
        org: 'Rivetfields',
        role: 'Co-Founder',
        period: 'Aug 2026 – Present',
        place: 'Boston, MA',
        href: 'https://rivetfields.com',
        summary: 'Infrastructure for long-horizon RL agent training and evaluation.',
        points: [
            'Building benchmark datasets distilled from frontier models, end-to-end simulation environments, and private inference that runs in the customer’s own cloud.',
            'Built a working prototype data harness for Day of AI’s pilot: natural-language analytics over social posts and program data with source-linked answers, reusable workflows, and scheduled reporting.',
        ],
        tags: ['RL environments', 'Evaluation', 'Private inference'],
    },
    {
        org: 'MIT RAISE / Day of AI',
        role: 'Learning Software Engineering Intern',
        period: 'Jul 2025 – May 2026',
        place: 'Cambridge, MA',
        summary: 'Production AI services for national AI-literacy programs.',
        points: [
            'Designed, deployed, and maintained a production AI data pipeline (Python/FastAPI) on the Meta Cloud API with entity-level parsing, retry handling, and idempotent deduplication, serving thousands of registered users.',
            'Built multi-user session state with PostgreSQL persistence and Alembic migrations, guarded by a 79+ test suite running in GitHub Actions CI.',
            'Rebuilt Teachable Machine as an offline-capable PWA with TensorFlow.js in-browser inference, deployed to 150+ teachers in Rwanda.',
        ],
        tags: ['Python', 'FastAPI', 'PostgreSQL', 'TensorFlow.js', 'PWA'],
        see: [
            { label: 'Try the WhatsApp bridge', href: '#project-bridge' },
            { label: 'Try Teachable Machine v3', href: '#project-teachable' },
        ],
    },
    {
        org: 'CATLAB — Center for Applied Technology',
        role: 'Software Engineering Intern',
        period: 'May – Aug 2024',
        place: 'Santa Barbara, CA',
        summary: 'Contributed to Westmont\u2019s campus app, building its Directory and Attendance tabs.',
        points: [
            'Built the Attendance tab: time-series data ingestion, role-based access control, and tiered authentication, giving 1,580+ campus users real-time visibility into their attendance standing.',
            'Built the Directory tab in React/TypeScript with virtualized rendering, debounced search, and a Node.js API layer, used by faculty and students for daily lookups.',
        ],
        tags: ['React', 'TypeScript', 'Node.js', 'RBAC'],
    },
];

export const education = {
    school: 'Westmont College',
    degree: 'B.S. Data Analytics · B.A. Computer Science',
    period: 'Graduating Aug 2026',
    place: 'Santa Barbara, CA',
    coursework: ['Operating Systems', 'Database Systems', 'Data Structures & Algorithms', 'Programming Languages', 'Linear Algebra'],
    honors: ['LeFrak Scholar', 'Bridge2Rwanda Scholar', 'Augustinian Scholar', 'Wheaton Innovation Lab', 'Up-to-US Leadership'],
};

export const skills = [
    { group: 'Languages', items: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'C++', 'Java'] },
    { group: 'Backend & data', items: ['FastAPI', 'Node.js', 'REST APIs', 'PostgreSQL', 'SQLAlchemy', 'Alembic', 'Redis', 'pytest'] },
    { group: 'Frontend', items: ['React', 'TypeScript', 'PWAs', 'TensorFlow.js'] },
    { group: 'Systems', items: ['Linux (services, permissions, logs)', 'TCP/IP, DNS & ports', 'OS fundamentals', 'Data structures & algorithms'] },
    { group: 'Tooling', items: ['Docker', 'Git', 'GitHub Actions', 'Shell scripting'] },
];

// Community & leadership (from the previous site's leadership list + resume).
export const community = {
    featured: {
        title: 'Ganza Mwari Initiative',
        role: 'Founder',
        period: 'Dec 2021 – Present',
        place: 'Rwamagana, Rwanda',
        story: 'Ganza Mwari (“Advanced Woman”) began as a response to rising teen dropouts after COVID. With local government and the Aegis Trust we opened a rent-free workspace offering vocational training and financial literacy for teen mothers. Watching human-led support hit its limits is why I build technology that has to work at scale, and in places the network forgets.',
    },
    highlight: {
        value: '$650K',
        label: 'raised at the Agahozo-Shalom Youth Village gala in New York, where I spoke for the village’s orphaned and vulnerable youth.',
        role: 'Fundraiser & speaker',
        period: 'Jan 2025 – Present',
    },
    roles: [
        { role: 'Co-founder & Co-president', org: 'African Students Union, Westmont', period: '2023 – 2024' },
        { role: 'Co-president', org: 'Global & International Students Association', period: '2023 – 2024' },
        { role: 'Co-founder', org: 'ASYV Critical Thinking for Peace', period: '2017 – 2018' },
    ],
};
