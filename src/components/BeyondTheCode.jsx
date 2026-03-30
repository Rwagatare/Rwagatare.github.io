import { useState, useEffect, useCallback } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import useTilt from '../hooks/useTilt';
import Typewriter from './Typewriter';
import './BeyondTheCode.css';

const interests = [
    { id: 'books', label: 'Books', icon: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z' },
    { id: 'community', label: 'Community', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' },
    { id: 'travel', label: 'Travel', icon: 'M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' },
];

const communityCategories = ['Volunteering', 'Mentorship', 'Clubs', 'Education'];

const communityItems = [
    {
        title: 'Ganza Mwari Initiative',
        category: 'Volunteering',
        role: 'Founder & Lead',
        period: '2019 – Present',
        location: 'Rwamagana, Rwanda',
        description: 'Founded a community-driven initiative supporting young women through mentorship, digital literacy workshops, and access to educational resources. What started as informal sessions in a small room grew into a structured program reaching 100+ participants.',
        impact: '100+ young women mentored in digital literacy and personal development',
        tags: ['Mentorship', 'Digital Literacy', 'Women in Tech'],
    },
    {
        title: 'Day of AI Workshop Facilitator',
        category: 'Education',
        role: 'Lead Facilitator',
        period: '2024 – Present',
        location: 'MIT Media Lab',
        description: 'Designed and led hands-on AI literacy workshops for K-12 students, making machine learning concepts accessible through interactive activities. Built custom curriculum materials bridging the gap between technical concepts and everyday student experiences.',
        impact: 'Reached 200+ students across multiple school districts',
        tags: ['AI Literacy', 'Education', 'K-12'],
    },
    {
        title: 'ASYV Fundraiser Organizer',
        category: 'Volunteering',
        role: 'Event Coordinator',
        period: '2022 – 2024',
        location: 'Westmont College',
        description: 'Organized annual fundraising events for the Agahozo-Shalom Youth Village in Rwanda — a residential community for orphaned and vulnerable youth. Coordinated campus-wide campaigns combining storytelling, cultural showcases, and digital outreach.',
        impact: 'Raised $5,000+ across multiple events for youth housing and education',
        tags: ['Fundraising', 'Rwanda', 'Youth Development'],
    },
    {
        title: 'Westmont CS Peer Tutor',
        category: 'Mentorship',
        role: 'Peer Tutor & Mentor',
        period: '2023 – 2025',
        location: 'Westmont College',
        description: 'Provided one-on-one and group tutoring for introductory and intermediate CS courses. Developed a tutoring approach that met students where they were — translating abstract concepts into concrete, relatable examples.',
        impact: 'Supported 50+ students through data structures, algorithms, and OOP courses',
        tags: ['Tutoring', 'CS Education', 'Mentorship'],
    },
    {
        title: 'Rwandan Student Association',
        category: 'Clubs',
        role: 'President',
        period: '2023 – 2025',
        location: 'Westmont College',
        description: 'Led the campus Rwandan community, organizing cultural events, facilitating conversations about identity and belonging, and building bridges between Rwandan and American students through shared experiences and dialogue.',
        impact: 'Built a community space for cultural exchange and mutual support',
        tags: ['Leadership', 'Cultural Exchange', 'Community Building'],
    },
];

const travelPlaces = [
    {
        place: 'Kigali, Rwanda',
        emoji: '🇷🇼',
        year: 'Home',
        type: 'home',
        note: 'Where it all started. The hills, the people, the resilience — Kigali shaped who I am. Every time I return, I see the future being built.',
    },
    {
        place: 'Boston, MA',
        emoji: '🇺🇸',
        year: '2024',
        type: 'work',
        note: 'MIT Media Lab. Where I discovered that the intersection of technology and social impact isn\'t a niche — it\'s a movement. The energy of people building for good is contagious.',
    },
    {
        place: 'Santa Barbara, CA',
        emoji: '🌴',
        year: '2022 – 2026',
        type: 'study',
        note: 'Four years at Westmont College. The mountains meet the ocean here. It\'s where I learned to think deeply, code deliberately, and find community far from home.',
    },
    {
        place: 'Rwamagana, Rwanda',
        emoji: '🏡',
        year: 'Ongoing',
        type: 'community',
        note: 'Home of the Ganza Mwari Initiative. The small room where I first taught digital literacy to young women. Every workshop there reminds me why I do this work.',
    },
    {
        place: 'Nairobi, Kenya',
        emoji: '🇰🇪',
        year: '2023',
        type: 'travel',
        note: 'East Africa\'s tech hub. Seeing M-Pesa\'s impact firsthand taught me that the most transformative technology isn\'t always the most complex — it\'s the most accessible.',
    },
    {
        place: 'Akagera National Park',
        emoji: '🦁',
        year: '2024',
        type: 'travel',
        note: 'Rwanda\'s savanna. A reminder that the most sophisticated systems are natural ones. Watching elephants navigate their world with such intentionality puts algorithm design in perspective.',
    },
];

const bookCategories = ['CS / Tech Ethics', 'Philosophy', 'Self-Development', 'Research Papers'];

/*
 * Each book's `reflection` is now an object:
 *   summary   – one-liner shown in the book list
 *   body      – array of paragraphs (your full ~600-word notes)
 *   takeaways – short bullet-point highlights (optional)
 *
 * cover: Open Library cover URL (free, no API key)
 * link:  Google Books or publisher page
 *
 * Books without a reflection use `reflection: null`.
 * You can write as much as you want in body — the reader panel scrolls.
 */
const readings = [
    // ── 2026 ──
    {
        year: 2026, cat: 'CS / Tech Ethics', title: 'Race After Technology', author: 'Ruha Benjamin', status: 'reading',
        cover: 'https://covers.openlibrary.org/b/isbn/9781509526406-L.jpg',
        link: 'https://books.google.com/books?id=KZqJDwAAQBAJ',
        reflection: {
            summary: 'Exploring the "New Jim Code" — how tech can encode discrimination.',
            body: [
                'Ruha Benjamin introduces the concept of the "New Jim Code" — a framework for understanding how emerging technologies can reinforce existing racial hierarchies even when designed with the best intentions. The parallel to Jim Crow laws is deliberate and jarring: systems that appear neutral on the surface but produce deeply discriminatory outcomes.',
                'What strikes me most is how this maps onto my own work. When I build AI systems for Rwandan communities, I carry the assumption that technology will help. Benjamin forces me to interrogate that assumption. Who defined "help"? Whose data trained the model? Whose reality does the algorithm optimize for?',
                'The book walks through case studies — from predictive policing algorithms that over-surveil Black neighborhoods to healthcare algorithms that systematically underserve Black patients. Each example follows the same pattern: a seemingly objective system that inherits and amplifies the biases of its creators.',
                'For me, the most actionable chapter was on "engineered inequity" — the idea that default settings are political choices. Every dropdown menu, every categorization scheme, every data field I design embeds assumptions about who the user is and what they need. There is no neutral design.',
                'I keep returning to one question Benjamin poses: "Can we build technology that dismantles rather than reinforces existing hierarchies?" This is the question I want my career to answer. Not through utopian thinking, but through rigorous, community-centered design that starts with the people most affected.'
            ],
            takeaways: [
                'Default settings are political choices — always interrogate them',
                'Technology inherits the biases of its creators and their data',
                'Community-centered design must start with those most affected',
                '"Neutral" systems often produce discriminatory outcomes'
            ]
        }
    },
    {
        year: 2026, cat: 'Research Papers', title: 'Human-AI Interaction in the Age of Large Language Models', author: 'Various', status: 'reading',
        cover: null,
        link: null,
        reflection: {
            summary: 'How LLMs are reshaping interaction design paradigms.',
            body: [
                'This survey paper maps the rapidly evolving landscape of human-AI interaction as LLMs move from research curiosities to everyday tools. The authors argue that LLMs represent a fundamental shift in how humans interact with computers — from command-based to conversation-based interfaces.',
                'The most relevant section for my work at Day of AI covers "scaffolded interaction" — how LLM-based tutoring systems can adapt their explanation style to the learner. The paper presents evidence that conversational AI tutors can approach the effectiveness of one-on-one human tutoring, but only when the interaction design accounts for the model\'s limitations.',
                'I found the taxonomy of interaction patterns particularly useful: generation, refinement, exploration, and delegation. Each pattern has different trust requirements and failure modes. When I design chatbot tutors, I\'m primarily in "exploration" mode — helping students discover concepts through guided dialogue rather than direct instruction.',
                'The paper also addresses a concern I\'ve been wrestling with: how do we design AI interactions that build user agency rather than dependence? The authors propose "progressive disclosure of AI capability" — starting with minimal assistance and gradually revealing more powerful features as the user develops their own understanding.'
            ],
            takeaways: [
                'Conversational AI tutors approach 1:1 human tutoring effectiveness with good design',
                'Four interaction patterns: generation, refinement, exploration, delegation',
                'Progressive disclosure prevents learned helplessness with AI tools'
            ]
        }
    },
    {
        year: 2026, cat: 'Self-Development', title: 'Designing for the Digital Age', author: 'Kim Goodwin', status: 'reading',
        cover: 'https://covers.openlibrary.org/b/isbn/9780470229101-L.jpg',
        link: 'https://books.google.com/books?id=Hpf09QEACAAJ',
        reflection: {
            summary: 'Goal-directed design methods for real-world constraints.',
            body: [
                'Kim Goodwin\'s book is essentially a masterclass in goal-directed design — the methodology pioneered at Cooper. What makes it different from most design books is its unflinching practicality. This isn\'t about inspiration; it\'s about process.',
                'The section on persona development changed how I approach user research. Goodwin argues that personas should emerge from behavioral patterns in research data, not from demographic assumptions. In resource-constrained contexts like my work in Rwanda, where you can\'t always run a full design sprint, she offers pragmatic shortcuts that don\'t sacrifice rigor.',
                'I\'m particularly drawn to her framework for stakeholder interviews. In my experience at CATLAB, the biggest design failures come not from misunderstanding users but from misunderstanding organizational constraints. Goodwin treats stakeholder alignment as a design activity in itself — something to be prototyped and tested just like a user interface.',
                'The book is dense — over 700 pages — but every chapter earns its space. I keep returning to her distinction between "designing for" users versus "designing with" them. The latter requires a fundamentally different power dynamic, one where the designer\'s expertise is in facilitating rather than prescribing.'
            ],
            takeaways: [
                'Personas should emerge from behavioral patterns, not demographics',
                'Stakeholder alignment is itself a design activity',
                'Design "with" users, not "for" them — facilitate, don\'t prescribe'
            ]
        }
    },
    { year: 2026, cat: 'CS / Tech Ethics', title: 'Algorithms of Oppression', author: 'Safiya Noble', status: 'queued', cover: 'https://covers.openlibrary.org/b/isbn/9781479837243-L.jpg', link: 'https://books.google.com/books?id=XgKuDgAAQBAJ', reflection: null },
    { year: 2026, cat: 'Philosophy', title: 'The Ethics of Ambiguity', author: 'Simone de Beauvoir', status: 'queued', cover: 'https://covers.openlibrary.org/b/isbn/9781504054225-L.jpg', link: 'https://books.google.com/books?id=wMU3AQAAIAAJ', reflection: null },

    // ── 2025 ──
    {
        year: 2025, cat: 'CS / Tech Ethics', title: 'Weapons of Math Destruction', author: "Cathy O'Neil", status: 'completed',
        cover: 'https://covers.openlibrary.org/b/isbn/9780553418811-L.jpg',
        link: 'https://books.google.com/books?id=NgEwBQAAQBAJ',
        reflection: {
            summary: 'How algorithms reinforce inequality at scale.',
            body: [
                'Cathy O\'Neil, a mathematician turned data scientist turned whistleblower, systematically dismantles the myth of algorithmic objectivity. She coined "Weapons of Math Destruction" (WMDs) to describe models that are opaque, unregulated, and operate at scale — a combination that makes them uniquely dangerous.',
                'The book is organized around sectors: education, criminal justice, lending, insurance, advertising. In each case, O\'Neil shows how models trained on historical data don\'t just reflect existing inequalities — they amplify them through feedback loops. A model that predicts recidivism based on zip code effectively predicts race, then creates the conditions for more arrests in those same zip codes.',
                'What resonates most with my work is her critique of "proxy variables." When direct measurement is difficult, models use proxies that often correlate with protected characteristics. This is exactly the trap I need to avoid when building AI literacy tools — optimizing for engagement metrics that might proxy for socioeconomic access rather than actual learning.',
                'The most sobering chapter covers the rise of algorithmic hiring. Models that screen resumes based on patterns from existing employees systematically filter out anyone who doesn\'t look like the current workforce. O\'Neil calls this "efficiency" argument the most dangerous myth in tech — that speed and scale justify opacity.',
                'I finished this book questioning every optimization I\'ve ever built. Which is, I think, exactly the point. The question isn\'t whether to use algorithms — it\'s whether we have the humility to audit them, the courage to shut them down when they fail, and the commitment to center the people they affect.'
            ],
            takeaways: [
                'Proxy variables often encode protected characteristics like race',
                'Feedback loops amplify inequalities — models create the conditions they predict',
                'Algorithmic efficiency arguments are the most dangerous myth in tech',
                'Every model should be auditable and have a kill switch'
            ]
        }
    },
    {
        year: 2025, cat: 'Philosophy', title: 'Pedagogy of the Oppressed', author: 'Paulo Freire', status: 'completed',
        cover: 'https://covers.openlibrary.org/b/isbn/9780826412768-L.jpg',
        link: 'https://books.google.com/books?id=xfFXz15OaF4C',
        reflection: {
            summary: 'Education as liberation, not deposit.',
            body: [
                'Freire\'s central critique — the "banking model" of education where teachers deposit information into passive students — struck me as a perfect description of most educational technology. We build platforms that deliver content, test recall, and call it learning. Freire would call it domestication.',
                'The alternative he proposes is "problem-posing education," where teacher and student engage in mutual dialogue about real-world problems. Learning happens not through transmission but through praxis — the cycle of reflection and action. This is the theoretical foundation for the chatbot tutors I built at Day of AI.',
                'What makes Freire radical isn\'t his teaching methods — it\'s his insistence that education is inherently political. There is no neutral pedagogy. Every educational choice — what to teach, how to test, who gets access — reflects and reproduces power structures. This frames my work not as building "tools for learning" but as making choices about whose knowledge counts.',
                'The concept of "conscientização" (critical consciousness) — the process by which people become aware of the social forces shaping their lives — is what I want AI literacy education to achieve. Not just teaching students how AI works, but helping them see how AI shapes their world and empowering them to shape it back.',
                'I keep coming back to Freire\'s insistence that liberation cannot be done "for" people — only "with" them. This maps directly onto participatory design: the communities I build for must be partners in the design process, not subjects of it.'
            ],
            takeaways: [
                'The "banking model" of education describes most edtech perfectly',
                'Problem-posing education: learn through dialogue about real problems',
                'No pedagogy is neutral — every design choice is political',
                'Liberation must be done "with" people, not "for" them'
            ]
        }
    },
    {
        year: 2025, cat: 'Research Papers', title: 'Decolonial AI: Decolonial Theory as Sociotechnical Foresight', author: 'Mohamed et al.', status: 'completed',
        cover: null,
        link: null,
        reflection: {
            summary: 'AI development through a postcolonial lens.',
            body: [
                'This paper applies decolonial theory to AI development — arguing that current AI systems risk reproducing colonial patterns of knowledge extraction, labor exploitation, and cultural erasure. The authors propose "decolonial AI" as both a critical framework and a practical methodology.',
                'The core argument is that AI development mirrors colonial dynamics: data is extracted from communities (often in the Global South), processed by institutions (predominantly in the Global North), and deployed in ways that serve the extractors\' interests. The communities whose data powers these systems rarely benefit from them.',
                'This directly informs my approach to building technology for Rwandan communities. The paper gave me language for something I felt intuitively — that "bringing AI to Africa" can easily become another form of extraction if the design process doesn\'t center local knowledge, local needs, and local ownership.',
                'The most actionable framework in the paper is their taxonomy of colonial AI harms: algorithmic exploitation, algorithmic dispossession, and algorithmic discrimination. Each category suggests different design interventions. For my work, algorithmic dispossession — where AI systems undermine local knowledge systems — is the most relevant risk.',
                'I now use their "foresight" methodology when starting any project: before asking "what can AI do here?", I ask "what existing knowledge systems would this displace, and who benefits from the displacement?"'
            ],
            takeaways: [
                'AI development can mirror colonial patterns of extraction',
                'Three harms: exploitation, dispossession, discrimination',
                'Before building: ask what knowledge systems this displaces',
                'Local ownership must be designed in from the start'
            ]
        }
    },
    {
        year: 2025, cat: 'Self-Development', title: 'Range', author: 'David Epstein', status: 'completed',
        cover: 'https://covers.openlibrary.org/b/isbn/9780735214484-L.jpg',
        link: 'https://books.google.com/books?id=flMfDwAAQBAJ',
        reflection: {
            summary: 'Generalists outperform specialists in complex domains.',
            body: [
                'David Epstein makes a compelling case against early specialization and for the kind of broad, interdisciplinary thinking that characterizes the world\'s most creative problem solvers. In a culture that worships the 10,000-hour rule, this book is a necessary corrective.',
                'The core thesis: in "wicked" learning environments (complex, ambiguous, with delayed feedback), generalists who draw from multiple domains consistently outperform narrow specialists. This validated my own path — CS + social impact + community organizing — in a way I didn\'t know I needed.',
                'The chapter on "lateral thinking with withered technology" — Nintendo\'s philosophy of using mature, cheap technology in creative new combinations — perfectly describes my approach to building AI tools for resource-constrained contexts. You don\'t need cutting-edge hardware to build transformative educational technology.',
                'Epstein also challenges the "grit" narrative. Knowing when to quit — when to pivot from a path that isn\'t working — is as important as persistence. This reframed how I think about failed projects: not as wasted time but as exploration that expands your range.',
                'The book\'s most profound insight is that analogical thinking — the ability to map concepts from one domain onto another — is the hallmark of exceptional problem solvers. This is exactly what happens when I apply critical theory to system design or use community organizing principles to structure a software team.'
            ],
            takeaways: [
                'Generalists outperform specialists in complex, ambiguous domains',
                'Lateral thinking with "withered technology" — creativity over cutting-edge',
                'Knowing when to quit is as valuable as persistence',
                'Analogical thinking across domains drives creative problem-solving'
            ]
        }
    },

    // ── 2024 ──
    {
        year: 2024, cat: 'Philosophy', title: 'The Design of Everyday Things', author: 'Don Norman', status: 'completed',
        cover: 'https://covers.openlibrary.org/b/isbn/9780465050659-L.jpg',
        link: 'https://books.google.com/books?id=nVQPAAAAQBAJ',
        reflection: {
            summary: 'Affordances, signifiers, and human-centered design.',
            body: [
                'Don Norman\'s classic is fundamentally about one idea: when humans struggle with a design, the fault lies with the design, not the human. This reframing — from "user error" to "design error" — is the foundation of everything I build.',
                'The key concepts — affordances (what an object allows you to do), signifiers (what communicates how to use it), and constraints (what prevents misuse) — gave me a precise vocabulary for design decisions I was making intuitively. Now when I review a UI, I can articulate exactly why something feels wrong.',
                'Norman\'s "seven stages of action" model (forming goals, planning, specifying, performing, perceiving, interpreting, comparing) is a powerful diagnostic tool. When a user struggles, you can pinpoint which stage broke down. Is the problem in forming the goal? In perceiving feedback? Each diagnosis leads to a different fix.',
                'The chapter on error design changed how I think about validation. Norman argues for designing systems that make errors impossible (constraints), easy to discover (feedback), and easy to recover from (undo). Most systems only do the middle one, and poorly at that.',
                'Every interface I build now starts with one question: "What does the user expect to happen?" If the system behaves differently from that expectation, the system is wrong, regardless of what the documentation says.'
            ],
            takeaways: [
                'When users struggle, the design is wrong — not the user',
                'Affordances, signifiers, constraints: precise vocabulary for design',
                'Seven stages of action: diagnostic tool for UX breakdowns',
                'Design for error: make mistakes impossible, discoverable, and recoverable'
            ]
        }
    },
    {
        year: 2024, cat: 'Self-Development', title: 'Deep Work', author: 'Cal Newport', status: 'completed',
        cover: 'https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg',
        link: 'https://books.google.com/books?id=4QTzCAAAQBAJ',
        reflection: {
            summary: 'Depth of focus produces disproportionate value.',
            body: [
                'Cal Newport\'s thesis is simple: the ability to perform deep, focused work is becoming simultaneously more valuable and more rare. In an economy that rewards knowledge work, the people who can concentrate without distraction will thrive.',
                'What changed for me was the practical framework, not just the philosophy. Newport proposes specific scheduling strategies — "time blocking," "shutdown rituals," and "productive meditation" — that I\'ve integrated into my daily routine. My most complex coding work (offline-first PWAs, ML model integration) happens in 90-minute deep work blocks.',
                'The distinction between deep and shallow work forced me to audit how I spend my time. I was shocked by how much of my day was reactive — responding to messages, checking notifications, context-switching between tasks. Newport argues this isn\'t laziness; it\'s the default behavior our tools are designed to produce.',
                'His critique of open offices and constant connectivity resonated with my experience in collaborative academic environments. Collaboration is valuable, but it needs to be structured. "Hub and spoke" models — where you retreat to deep work and converge for collaboration — produce better results than always-on availability.',
                'The book\'s most provocative claim: most knowledge workers could accomplish their daily output in 4 focused hours. The rest is what Newport calls "busyness as a proxy for productivity." I\'ve found this to be approximately true.'
            ],
            takeaways: [
                'Deep focus is both more valuable and rarer than ever',
                '90-minute time blocks for complex technical work',
                'Audit your day: most "work" is reactive shallow activity',
                'Structured collaboration beats always-on availability'
            ]
        }
    },
    {
        year: 2024, cat: 'Research Papers', title: 'Teachable Machine: Approachable Web-Based Tool for Exploring ML', author: 'Carney et al., Google', status: 'completed',
        cover: null,
        link: null,
        reflection: {
            summary: 'The design foundation behind my Teachable Machine V3 work.',
            body: [
                'This paper documents the design decisions behind Google\'s Teachable Machine — a web-based tool that lets anyone train a simple ML model without writing code. As the foundation for my own Teachable Machine V3 adaptation, understanding these decisions was essential.',
                'The authors prioritized three design principles: immediacy (see results instantly), expressiveness (use your own examples), and extensibility (export and use models elsewhere). My offline adaptation had to preserve these principles while working without an internet connection — a significant constraint that forced creative solutions.',
                'The most valuable insight was their approach to progressive complexity. The tool starts with a two-class image classifier — the simplest possible ML task. Users can then add classes, switch to audio or pose detection, and eventually export models to more complex environments. Each step reveals new capability without overwhelming.',
                'Their evaluation methodology — observing workshop participants and coding interaction patterns — also influenced how I evaluated my V3 adaptation. Rather than measuring accuracy or completion rates, they focused on moments of "conceptual breakthrough" — when participants visibly shifted their mental model of how ML works.',
                'The paper confirmed my belief that the best educational technology makes the invisible visible. ML is powerful because it finds patterns humans can\'t see. Teachable Machine makes that process visible and tangible.'
            ],
            takeaways: [
                'Three principles: immediacy, expressiveness, extensibility',
                'Progressive complexity: simplest task first, reveal capability gradually',
                'Measure conceptual breakthroughs, not just completion rates',
                'Best edtech makes the invisible visible'
            ]
        }
    },

    // ── 2023 ──
    {
        year: 2023, cat: 'CS / Tech Ethics', title: 'Artificial Unintelligence', author: 'Meredith Broussard', status: 'completed',
        cover: 'https://covers.openlibrary.org/b/isbn/9780262537018-L.jpg',
        link: 'https://books.google.com/books?id=szY5DwAAQBAJ',
        reflection: {
            summary: 'Challenging technochauvinism — tech is not always the answer.',
            body: [
                'Broussard coins "technochauvinism" — the belief that technology is always the solution to every problem — and then spends 200 pages demolishing it with case studies, data, and dry wit. For someone building AI tools, this book is essential medicine.',
                'The most impactful chapter covers Philadelphia\'s school system and its failed attempt to replace teachers with technology. The technology wasn\'t bad; the assumption that technology could substitute for human relationships was. This is a distinction I now apply to every project kickoff.',
                'Broussard makes an important point about AI hype cycles: the gap between what AI can do in a lab and what it can do in the real world is enormous. Controlled benchmarks don\'t account for messy data, adversarial users, infrastructure failures, or the social context in which the system operates.',
                'What I took from this book isn\'t anti-technology. It\'s a more honest framework for asking: "Is technology the right tool here? What would a non-technological solution look like? And who benefits from framing this as a technology problem?"'
            ],
            takeaways: [
                'Technochauvinism: the assumption tech is always the answer',
                'Technology cannot substitute for human relationships',
                'Lab benchmarks ≠ real-world performance',
                'Always ask: who benefits from framing this as a tech problem?'
            ]
        }
    },
    {
        year: 2023, cat: 'Self-Development', title: 'Atomic Habits', author: 'James Clear', status: 'completed',
        cover: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
        link: 'https://books.google.com/books?id=lFhbDwAAQBAJ',
        reflection: {
            summary: 'Systems over goals — small daily commits compound.',
            body: [
                'James Clear\'s core argument is that goals are less important than systems. Everyone who enters a marathon has the goal of finishing. The people who finish are the ones with daily training systems. Applied to software engineering: everyone wants to ship great products. The people who do have daily habits that compound.',
                'The "1% better every day" framing resonated with how I approach side projects. A single commit per day doesn\'t feel like much. But 365 commits later, you have a fully functional application. The math of compounding applies to skills exactly as it applies to money.',
                'His four laws of behavior change — make it obvious, attractive, easy, and satisfying — map surprisingly well onto developer experience design. The best APIs and tools succeed because they make the right behavior the easy behavior.',
                'The identity-based habit model was the real breakthrough for me. Instead of "I want to build an app," it\'s "I am a person who ships code daily." The behavior follows from the identity, not the goal. I\'ve applied this reframing to my writing practice, my reading habit, and my open-source contributions.'
            ],
            takeaways: [
                'Systems > goals — focus on daily processes, not outcomes',
                '1% improvement compounds: 365 small commits = a real product',
                'Four laws: make desired behavior obvious, attractive, easy, satisfying',
                'Identity-based habits: "I am someone who..." drives behavior'
            ]
        }
    },
    {
        year: 2023, cat: 'Philosophy', title: 'Man\'s Search for Meaning', author: 'Viktor Frankl', status: 'completed',
        cover: 'https://covers.openlibrary.org/b/isbn/9780807014295-L.jpg',
        link: 'https://books.google.com/books?id=K2AvNE27BTMC',
        reflection: {
            summary: 'Purpose as the primary human drive.',
            body: [
                'Frankl\'s account of surviving Auschwitz is harrowing, but the book\'s lasting contribution is logotherapy — the idea that the primary human drive is not pleasure (Freud) or power (Adler) but meaning. Those who survived the camps, Frankl observed, were those who maintained a sense of purpose.',
                'The most quoted line — "He who has a why to live can bear almost any how" — is often trivialized on Instagram. In context, surrounded by the worst suffering humans have inflicted on each other, it carries immense weight. Purpose isn\'t a productivity hack; it\'s a survival strategy.',
                'For my career, this book reinforced my commitment to meaningful work over prestigious work. The pull toward big-name tech companies is strong. But Frankl\'s framework asks: what gives your work meaning? For me, it\'s building technology that serves communities that are typically extracted from, not served.',
                'Frankl also argues that meaning can\'t be pursued directly — it must ensue from engagement with the world. You find meaning by throwing yourself into work, love, and suffering, not by searching for meaning itself. This maps onto my experience: I didn\'t set out to find meaningful work. I followed problems I cared about and meaning emerged.'
            ],
            takeaways: [
                'The primary human drive is meaning — not pleasure or power',
                'Purpose is a survival strategy, not a productivity hack',
                'Meaningful work > prestigious work',
                'Meaning ensues from engagement; it can\'t be pursued directly'
            ]
        }
    },

    // ── 2022 ──
    {
        year: 2022, cat: 'Self-Development', title: 'The Pragmatic Programmer', author: 'Hunt & Thomas', status: 'completed',
        cover: 'https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg',
        link: 'https://books.google.com/books?id=LhOlDwAAQBAJ',
        reflection: {
            summary: 'The book that leveled up my engineering mindset.',
            body: [
                'Hunt and Thomas wrote the engineering mindset manual. Not a book about any specific language or framework, but about how to think as a software professional. DRY (Don\'t Repeat Yourself), orthogonality, tracer bullets, rubber duck debugging — concepts I now reference daily.',
                'The "tracer bullet" metaphor was transformative for how I approach new projects. Instead of building a complete architecture and then connecting the pieces, fire a tracer bullet — a thin, end-to-end slice that proves the whole system can work. Then iterate. This is how I built the first version of my WhatsApp bridge: get one message flowing from end to end, then build out.',
                'Their treatment of "good enough" software challenged my perfectionist tendencies. Software doesn\'t need to be perfect; it needs to be good enough for its users, delivered on time, and maintainable. Know when to stop polishing.',
                'The chapter on estimation — "Program Close to the Problem Domain" — changed how I communicate with non-technical stakeholders. Speaking in the language of the problem domain rather than the implementation domain makes collaboration possible. It\'s a skill I use daily at CATLAB.'
            ],
            takeaways: [
                'Tracer bullets: build thin end-to-end slices first, then iterate',
                'DRY and orthogonality: the foundation of maintainable code',
                '"Good enough" software, delivered on time, beats perfect software',
                'Communicate in the problem domain, not the implementation domain'
            ]
        }
    },
    {
        year: 2022, cat: 'CS / Tech Ethics', title: 'Automating Inequality', author: 'Virginia Eubanks', status: 'completed',
        cover: 'https://covers.openlibrary.org/b/isbn/9781250074317-L.jpg',
        link: 'https://books.google.com/books?id=pmY7DwAAQBAJ',
        reflection: {
            summary: 'How automated systems target the most vulnerable.',
            body: [
                'Virginia Eubanks examines three case studies where automated decision-making systems disproportionately harm poor and working-class people: a Medicaid eligibility system in Indiana, a coordinated entry system for homeless services in Los Angeles, and a predictive model for child abuse in Allegheny County.',
                'The Indiana case is particularly damning. When the state automated Medicaid eligibility, a million applications were denied in three years — many for minor paperwork errors that a human caseworker would have resolved with a phone call. The system optimized for efficiency and produced cruelty.',
                'Eubanks introduces the concept of the "digital poorhouse" — the modern descendant of the physical poorhouse, using technology to profile, police, and punish the poor. The parallel is precise: both systems claim to help while primarily functioning as mechanisms of social control.',
                'For my work building public-facing technology, this book is a permanent reminder: the populations most affected by automated systems are the least likely to have the resources to challenge them. Design for the most vulnerable user, or your system will exploit them.'
            ],
            takeaways: [
                'Automation optimized for efficiency can produce cruelty',
                'The "digital poorhouse": tech as social control',
                'Minor errors that humans forgive become denials in automated systems',
                'Design for the most vulnerable user, or the system will exploit them'
            ]
        }
    },
    {
        year: 2022, cat: 'Research Papers', title: 'Attention Is All You Need', author: 'Vaswani et al.', status: 'completed',
        cover: null,
        link: null,
        reflection: {
            summary: 'The transformer architecture from the source.',
            body: [
                'Reading the original transformer paper after years of using transformer-based models was like reading the blueprint of a building you\'ve lived in. Suddenly the architecture makes sense — not as a black box but as a series of deliberate design decisions.',
                'The key insight: self-attention allows the model to weigh the importance of different parts of the input when producing each part of the output. Unlike RNNs, which process sequences one token at a time, transformers can attend to the entire sequence simultaneously. This parallelism is what makes them trainable at scale.',
                'Understanding multi-head attention — running multiple attention operations in parallel and concatenating results — gave me intuition for why these models can capture such diverse patterns. Each head can learn to attend to different types of relationships in the data.',
                'The positional encoding scheme (sinusoidal functions at different frequencies) is elegant. Since attention has no inherent notion of order, position must be injected explicitly. The sine/cosine approach lets the model generalize to sequence lengths unseen during training.',
                'Reading this paper didn\'t make me a better ML researcher. But it made me a better engineer of ML-powered products. Knowing what transformers can and can\'t do — knowing that attention is O(n²) in sequence length, that positional information is added not learned, that the architecture is fundamentally a pattern-matching machine — helps me make informed decisions about when and how to deploy these models.'
            ],
            takeaways: [
                'Self-attention: weigh importance of all input parts simultaneously',
                'Multi-head attention captures diverse relationship patterns',
                'Attention is O(n²) in sequence length — architecture has limits',
                'Understanding architecture → better product decisions'
            ]
        }
    },

    // ── 2021 ──
    {
        year: 2021, cat: 'Self-Development', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', status: 'completed',
        cover: 'https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg',
        link: 'https://books.google.com/books?id=ZuKTvERuPG8C',
        reflection: {
            summary: 'System 1 vs System 2 thinking maps onto UX design.',
            body: [
                'Kahneman\'s dual-process theory — fast, intuitive System 1 and slow, deliberate System 2 — is the most useful mental model I\'ve encountered for designing user interfaces. Every design decision is essentially choosing which system you\'re designing for.',
                'System 1 is pattern matching. It\'s why users click buttons that look like buttons, why they expect red to mean "stop" or "error," and why consistent navigation feels "right." Good UI design leverages System 1 by meeting expectations. Bad design forces System 2 engagement for routine tasks.',
                'The chapters on cognitive biases — anchoring, availability, loss aversion — directly apply to how users perceive and interact with technology. Loss aversion explains why users resist changes to interfaces they\'ve learned, even when the new design is objectively better. Understanding this changed how I approach redesigns.',
                'For AI interface design specifically, Kahneman\'s work on "What You See Is All There Is" (WYSIATI) is critical. Users build their mental model of an AI system from whatever information is visible. If the system doesn\'t explain its limitations, users assume it has none. This is why transparency in AI interfaces isn\'t just ethical — it\'s functional.'
            ],
            takeaways: [
                'System 1 (intuitive) vs System 2 (deliberate): design for the right one',
                'Good UI meets expectations (System 1); bad UI forces deliberation',
                'Loss aversion explains resistance to UI changes',
                'WYSIATI: users assume AI has no limitations unless told otherwise'
            ]
        }
    },
    {
        year: 2021, cat: 'Philosophy', title: 'The Republic', author: 'Plato', status: 'completed',
        cover: 'https://covers.openlibrary.org/b/isbn/9780140455113-L.jpg',
        link: 'https://books.google.com/books?id=MxBVAAAAcAAJ',
        reflection: {
            summary: 'Ancient questions about justice, education, and governance.',
            body: [
                'Reading Plato in the context of AI governance was a revelation. The questions he poses in The Republic — What is justice? Who should rule? How should citizens be educated? — are the same questions we\'re now asking about algorithms, platforms, and artificial intelligence.',
                'The Allegory of the Cave is the most enduring metaphor in philosophy, and it maps perfectly onto digital literacy. We live in a world of algorithmic shadows — curated feeds, personalized search results, recommendation engines — and believe them to be reality. Education, for Plato, is the painful process of turning toward the light.',
                'Plato\'s argument for philosopher-kings — that those who understand truth should govern — raises uncomfortable questions about technocracy. Silicon Valley often operates on a similar assumption: that those who understand technology should shape society. But Plato also shows the dangers of this thinking when wisdom becomes dogma.',
                'The dialogue format itself was instructive. Socratic questioning — arriving at truth through structured dialogue rather than lecture — is the pedagogical approach I try to embed in the chatbot tutors I build. Not giving answers, but asking questions that lead students to discover answers themselves.'
            ],
            takeaways: [
                'AI governance questions are ancient philosophy questions in new form',
                'The Cave allegory maps onto algorithmic filter bubbles',
                'Beware technocracy: understanding tech ≠ the right to shape society',
                'Socratic method: questions that lead to discovery, not lectures'
            ]
        }
    },

    // ── 2020 ──
    {
        year: 2020, cat: 'CS / Tech Ethics', title: 'The Age of Surveillance Capitalism', author: 'Shoshana Zuboff', status: 'completed',
        cover: 'https://covers.openlibrary.org/b/isbn/9781610395694-L.jpg',
        link: 'https://books.google.com/books?id=lRqrDQAAQBAJ',
        reflection: {
            summary: 'Data extraction as a business model — and why we need alternatives.',
            body: [
                'Zuboff\'s 700-page opus defines "surveillance capitalism" as a new economic order that claims human experience as free raw material for commercial practices of extraction, prediction, and sales. It\'s not just that companies collect our data — it\'s that our behavior is the product being manufactured.',
                'This was the book that first made me think critically about the tech I was learning to build. Before reading Zuboff, I understood privacy as a personal preference. After, I understood it as a structural issue — the asymmetry of knowledge between platforms and users is itself a form of power.',
                'The concept of "behavioral surplus" — data collected beyond what\'s needed to improve a service, repurposed for prediction and manipulation — reframed my understanding of "free" products. When I build tools now, I ask: what data am I collecting? What do I actually need? What happens to the rest?',
                'Her distinction between "the right to sanctuary" and "the right to the future tense" (the right to act freely without being predicted and nudged) articulated something I felt but couldn\'t name. The most insidious aspect of surveillance capitalism isn\'t that it watches — it\'s that it shapes.',
                'This book is why I care about building technology that serves communities rather than extracting from them. It\'s the reason I chose social impact over a more lucrative path. If the default mode of tech is extraction, someone has to build the alternative.'
            ],
            takeaways: [
                'Surveillance capitalism: human experience as raw material for profit',
                'Privacy is structural, not personal — asymmetry of knowledge is power',
                'Behavioral surplus: data collected beyond what\'s needed, repurposed for control',
                'The right to the future tense: freedom from prediction and manipulation'
            ]
        }
    },
    {
        year: 2020, cat: 'Self-Development', title: 'Clean Code', author: 'Robert C. Martin', status: 'completed',
        cover: 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg',
        link: 'https://books.google.com/books?id=_i6bDeoCQzsC',
        reflection: {
            summary: 'Where my obsession with readable code started.',
            body: [
                'Robert Martin\'s Clean Code is opinionated, sometimes dogmatic, and occasionally wrong — but it fundamentally changed how I write software. The central thesis is simple: code is read far more often than it is written, so optimize for readability.',
                'The chapter on naming conventions alone was worth the price. "Use intention-revealing names." "Avoid disinformation." "Make meaningful distinctions." These rules sound obvious but violating them is the source of most confusion in codebases. I now spend as much time naming things as implementing them.',
                'His argument for small functions — each doing exactly one thing, at one level of abstraction — made my code dramatically easier to test and refactor. Before this book, I wrote functions that were 50-100 lines long. Now anything over 15 lines triggers a refactoring instinct.',
                'The book\'s most controversial stance is its opposition to comments. Martin argues that comments are a failure to express intent through code. While I think this goes too far — some things genuinely need explanation — the principle of preferring expressive code over explanatory comments has served me well.',
                'Clean Code isn\'t a book you read once. It\'s a book you internalize over years of practice. I still catch myself violating its principles, and that awareness itself is the book\'s lasting contribution.'
            ],
            takeaways: [
                'Code is read more than written — optimize for readability',
                'Naming is half the battle: intention-revealing, no disinformation',
                'Small functions, one level of abstraction, one responsibility',
                'Prefer expressive code over explanatory comments'
            ]
        }
    },
];

const years = [2026, 2025, 2024, 2023, 2022, 2021, 2020];

const BeyondTheCode = () => {
    const revealRef = useScrollReveal();
    const tilt = useTilt(4);
    const [activeInterest, setActiveInterest] = useState('books');
    const [activeYear, setActiveYear] = useState(2026);
    const [activeCat, setActiveCat] = useState(null);
    const [activeBook, setActiveBook] = useState(null);
    const [expandedCommunity, setExpandedCommunity] = useState(null);
    const [activeCommCat, setActiveCommCat] = useState(null);

    const handleInterestChange = (id) => {
        setActiveInterest(id);
        setActiveBook(null);
        setExpandedCommunity(null);
        setActiveCommCat(null);
    };

    const handleYearChange = (y) => {
        setActiveYear(y);
        setActiveBook(null);
    };

    const handleCatChange = (cat) => {
        setActiveCat(activeCat === cat ? null : cat);
        setActiveBook(null);
    };

    const openBook = (book) => {
        if (book.reflection) setActiveBook(activeBook === book ? null : book);
    };

    const closeReader = useCallback(() => setActiveBook(null), []);

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') closeReader(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [closeReader]);

    const filtered = readings.filter(
        (b) => b.year === activeYear && (activeCat === null || b.cat === activeCat)
    );

    const yearCats = [...new Set(readings.filter((b) => b.year === activeYear).map((b) => b.cat))];

    return (
        <section id="beyond" className="section-wrap container">
            <div className="reveal" ref={revealRef}>
                <h2 className="label"><span className="accent">//</span> Beyond the Code</h2>
                <Typewriter text="The books I read, the communities I serve, and the places that shaped how I think." />

                {/* ── Interest switcher ── */}
                <div className="btc-interests">
                    {interests.map((int) => (
                        <button
                            key={int.id}
                            className={`btc-interest-btn ${activeInterest === int.id ? 'active' : ''}`}
                            onClick={() => handleInterestChange(int.id)}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d={int.icon} />
                            </svg>
                            {int.label}
                        </button>
                    ))}
                </div>

                {/* ═══════════════ BOOKS ═══════════════ */}
                {activeInterest === 'books' && (
                    <div className="card btc-card" onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave}>
                        <div className="btc-cat-nav">
                            <button
                                className={`btc-cat-btn ${activeCat === null ? 'active' : ''}`}
                                onClick={() => handleCatChange(null)}
                            >All</button>
                            {bookCategories.map((cat) => (
                                <button
                                    key={cat}
                                    className={`btc-cat-btn ${activeCat === cat ? 'active' : ''} ${!yearCats.includes(cat) ? 'dimmed' : ''}`}
                                    onClick={() => handleCatChange(cat)}
                                    disabled={!yearCats.includes(cat)}
                                >{cat}</button>
                            ))}
                        </div>

                        <div className="btc-main">
                            <div className="btc-year-nav">
                                {years.map((y) => (
                                    <button
                                        key={y}
                                        className={`btc-year-btn ${activeYear === y ? 'active' : ''}`}
                                        onClick={() => handleYearChange(y)}
                                    >{y}</button>
                                ))}
                            </div>

                            <div className={`btc-content ${activeBook ? 'reader-open' : ''}`}>
                                <div className="btc-list-side">
                                    {filtered.length === 0 ? (
                                        <p className="btc-empty">No readings in this category for {activeYear}.</p>
                                    ) : (
                                        <div className="btc-books">
                                            {filtered.map((book, i) => (
                                                <div
                                                    key={`${book.title}-${i}`}
                                                    className={`btc-book ${activeBook === book ? 'selected' : ''} ${!book.reflection ? 'no-reflection' : ''}`}
                                                    onClick={() => openBook(book)}
                                                    role={book.reflection ? 'button' : undefined}
                                                    tabIndex={book.reflection ? 0 : undefined}
                                                    onKeyDown={(e) => e.key === 'Enter' && openBook(book)}
                                                >
                                                    <div className="btc-book-row">
                                                        <span className={`btc-dot ${book.status}`} />
                                                        <div className="btc-book-info">
                                                            <span className="btc-book-title">{book.title}</span>
                                                            <span className="btc-book-author">{book.author}</span>
                                                        </div>
                                                        <span className="btc-book-cat-tag">{book.cat}</span>
                                                        <span className="btc-book-status">{book.status}</span>
                                                        {book.reflection && (
                                                            <span className="btc-read-indicator" title="Read reflection">
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                                                                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                                                                </svg>
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="btc-legend">
                                        <span><span className="btc-dot reading" /> reading</span>
                                        <span><span className="btc-dot completed" /> completed</span>
                                        <span><span className="btc-dot queued" /> queued</span>
                                    </div>
                                </div>

                                <div className={`btc-reader ${activeBook ? 'open' : ''}`}>
                                    {activeBook && activeBook.reflection && (
                                        <>
                                            <div className="btc-reader-header">
                                                <button className="btc-reader-close" onClick={closeReader} aria-label="Close reader">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                                    </svg>
                                                </button>
                                                <span className={`btc-dot ${activeBook.status}`} />
                                                <div className="btc-reader-meta">
                                                    <span className="btc-reader-cat">{activeBook.cat}</span>
                                                    <span className="btc-reader-status">{activeBook.status}</span>
                                                </div>
                                            </div>
                                            <div className="btc-reader-scroll">
                                                {activeBook.cover && (
                                                    <img className="btc-reader-cover" src={activeBook.cover} alt={`${activeBook.title} cover`} loading="lazy" />
                                                )}
                                                <h3 className="btc-reader-title">{activeBook.title}</h3>
                                                <p className="btc-reader-author">by {activeBook.author}</p>
                                                {activeBook.link && (
                                                    <a className="btc-reader-link" href={activeBook.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                                                        </svg>
                                                        View on Google Books
                                                    </a>
                                                )}
                                                <div className="btc-reader-body">
                                                    {activeBook.reflection.body.map((para, i) => (<p key={i}>{para}</p>))}
                                                </div>
                                                {activeBook.reflection.takeaways && (
                                                    <div className="btc-reader-takeaways">
                                                        <h4>Key Takeaways</h4>
                                                        <ul>{activeBook.reflection.takeaways.map((t, i) => (<li key={i}>{t}</li>))}</ul>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══════════════ COMMUNITY ═══════════════ */}
                {activeInterest === 'community' && (
                    <div className="btc-community">
                        <div className="btc-comm-filter">
                            <button
                                className={`btc-comm-filter-btn ${activeCommCat === null ? 'active' : ''}`}
                                onClick={() => { setActiveCommCat(null); setExpandedCommunity(null); }}
                            >All</button>
                            {communityCategories.map((cat) => (
                                <button
                                    key={cat}
                                    className={`btc-comm-filter-btn ${activeCommCat === cat ? 'active' : ''}`}
                                    onClick={() => { setActiveCommCat(activeCommCat === cat ? null : cat); setExpandedCommunity(null); }}
                                >{cat}</button>
                            ))}
                        </div>
                        {communityItems.filter((item) => activeCommCat === null || item.category === activeCommCat).map((item, i) => (
                            <div
                                key={i}
                                className={`card btc-comm-card ${expandedCommunity === i ? 'expanded' : ''}`}
                                onClick={() => setExpandedCommunity(expandedCommunity === i ? null : i)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && setExpandedCommunity(expandedCommunity === i ? null : i)}
                            >
                                <div className="btc-comm-header">
                                    <div className="btc-comm-info">
                                        <h3 className="btc-comm-title">{item.title}</h3>
                                        <span className="btc-comm-role">{item.role}</span>
                                    </div>
                                    <div className="btc-comm-meta">
                                        <span className="btc-comm-cat-badge">{item.category}</span>
                                        <span className="btc-comm-period">{item.period}</span>
                                        <span className="btc-comm-location">{item.location}</span>
                                    </div>
                                    <span className="btc-comm-toggle">{expandedCommunity === i ? '−' : '+'}</span>
                                </div>
                                <div className={`btc-comm-body ${expandedCommunity === i ? 'show' : ''}`}>
                                    <p>{item.description}</p>
                                    <div className="btc-comm-impact">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                                        </svg>
                                        {item.impact}
                                    </div>
                                    <div className="btc-comm-tags">
                                        {item.tags.map((tag, j) => (
                                            <span key={j} className="btc-comm-tag">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ═══════════════ TRAVEL ═══════════════ */}
                {activeInterest === 'travel' && (
                    <div className="btc-travel">
                        {travelPlaces.map((place, i) => (
                            <div key={i} className={`card btc-place-card btc-place-${place.type}`}>
                                <div className="btc-place-emoji">{place.emoji}</div>
                                <div className="btc-place-info">
                                    <div className="btc-place-top">
                                        <h3 className="btc-place-name">{place.place}</h3>
                                        <span className="btc-place-year">{place.year}</span>
                                    </div>
                                    <span className={`btc-place-type ${place.type}`}>{place.type}</span>
                                    <p className="btc-place-note">{place.note}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default BeyondTheCode;
