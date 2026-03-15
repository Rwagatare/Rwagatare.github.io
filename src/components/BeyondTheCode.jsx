import { useState } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import useTilt from '../hooks/useTilt';
import './BeyondTheCode.css';

const categories = [
    {
        id: 'cs-ethics',
        label: 'CS / Tech Ethics',
        books: [
            {
                title: 'Weapons of Math Destruction',
                author: "Cathy O'Neil",
                status: 'completed',
                reflection: 'A sobering look at how algorithms can reinforce inequality — directly relevant to my work on empathetic AI systems. Made me question every "optimization" I build.'
            },
            {
                title: 'Race After Technology',
                author: 'Ruha Benjamin',
                status: 'reading',
                reflection: 'Exploring the "New Jim Code" — how tech can encode discrimination. Shapes how I think about building AI for Rwandan communities.'
            },
            {
                title: 'Algorithms of Oppression',
                author: 'Safiya Noble',
                status: 'queued',
                reflection: null
            }
        ]
    },
    {
        id: 'philosophy',
        label: 'Philosophy',
        books: [
            {
                title: 'The Design of Everyday Things',
                author: 'Don Norman',
                status: 'completed',
                reflection: 'Foundational thinking on affordances and human-centered design. Keeps me grounded in usability over complexity. Every interface I build now starts with "what does the user expect?"'
            },
            {
                title: 'Pedagogy of the Oppressed',
                author: 'Paulo Freire',
                status: 'reading',
                reflection: 'Education as liberation — connects directly to why I build AI literacy tools. The "banking model" of education is what I\'m trying to disrupt with interactive chatbots.'
            },
            {
                title: 'The Ethics of Ambiguity',
                author: 'Simone de Beauvoir',
                status: 'queued',
                reflection: null
            }
        ]
    },
    {
        id: 'self-dev',
        label: 'Self-Development',
        books: [
            {
                title: 'Designing for the Digital Age',
                author: 'Kim Goodwin',
                status: 'reading',
                reflection: 'A deep dive into goal-directed design methods. Reframing how I think about user research in resource-constrained contexts where you can\'t always run a full design sprint.'
            },
            {
                title: 'Deep Work',
                author: 'Cal Newport',
                status: 'completed',
                reflection: 'Changed how I structure my coding sessions. The idea that depth of focus produces disproportionate value resonates with building complex systems like offline-first PWAs.'
            },
            {
                title: 'Range',
                author: 'David Epstein',
                status: 'completed',
                reflection: 'Validated my path — CS + social impact + community organizing. Generalists who connect dots across domains often solve the hardest problems.'
            }
        ]
    },
    {
        id: 'research',
        label: 'Research Papers',
        books: [
            {
                title: 'Teachable Machine: Approachable Web-Based Tool for Exploring ML',
                author: 'Carney et al., Google',
                status: 'completed',
                reflection: 'The foundational paper behind my Teachable Machine V3 work. Understanding the original design decisions helped me make informed trade-offs for offline adaptation.'
            },
            {
                title: 'Decolonial AI: Decolonial Theory as Sociotechnical Foresight',
                author: 'Mohamed et al.',
                status: 'completed',
                reflection: 'Framework for thinking about AI development in postcolonial contexts. Directly informs how I approach building tech for Rwandan communities — centering local knowledge, not extracting data.'
            },
            {
                title: 'Human-AI Interaction in the Age of Large Language Models',
                author: 'Various',
                status: 'reading',
                reflection: 'Surveying the landscape of how LLMs change interaction design. Relevant to the chatbot tutoring systems I built for Day of AI.'
            }
        ]
    }
];

const BeyondTheCode = () => {
    const revealRef = useScrollReveal();
    const tilt = useTilt(4);
    const [activeCat, setActiveCat] = useState(0);
    const [expandedBook, setExpandedBook] = useState(null);

    const handleCatChange = (i) => {
        setActiveCat(i);
        setExpandedBook(null);
    };

    const toggleBook = (i) => {
        setExpandedBook(expandedBook === i ? null : i);
    };

    const cat = categories[activeCat];

    return (
        <section id="beyond" className="section-wrap container">
            <div className="reveal" ref={revealRef}>
                <h2 className="label"><span className="accent">//</span> Beyond the Code</h2>
                <div className="card btc-card" onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave}>
                    <div className="vtab-layout">
                        <div className="vtab-sidebar">
                            {categories.map((c, i) => (
                                <button
                                    key={c.id}
                                    className={`vtab-btn ${activeCat === i ? 'active' : ''}`}
                                    onClick={() => handleCatChange(i)}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>
                        <div className="vtab-content">
                            <div className="btc-books">
                                {cat.books.map((book, i) => (
                                    <div
                                        key={i}
                                        className={`btc-book ${expandedBook === i ? 'expanded' : ''}`}
                                        onClick={() => book.reflection && toggleBook(i)}
                                        role={book.reflection ? 'button' : undefined}
                                        tabIndex={book.reflection ? 0 : undefined}
                                        onKeyDown={(e) => e.key === 'Enter' && book.reflection && toggleBook(i)}
                                    >
                                        <div className="btc-book-row">
                                            <span className={`btc-dot ${book.status}`} />
                                            <div className="btc-book-info">
                                                <span className="btc-book-title">{book.title}</span>
                                                <span className="btc-book-author">{book.author}</span>
                                            </div>
                                            <span className="btc-book-status">{book.status}</span>
                                            {book.reflection && (
                                                <span className="btc-expand-icon">
                                                    {expandedBook === i ? '−' : '+'}
                                                </span>
                                            )}
                                        </div>
                                        {book.reflection && (
                                            <div className={`btc-reflection ${expandedBook === i ? 'show' : ''}`}>
                                                <p>{book.reflection}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="btc-legend">
                                <span><span className="btc-dot reading" /> reading</span>
                                <span><span className="btc-dot completed" /> completed</span>
                                <span><span className="btc-dot queued" /> queued</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BeyondTheCode;
