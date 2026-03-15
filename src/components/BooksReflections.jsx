import { useState } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import './BooksReflections.css';

const BooksReflections = () => {
    const revealRef = useScrollReveal();
    const [activeTab, setActiveTab] = useState('books');

    const books = [
        {
            title: 'Designing for the Digital Age',
            author: 'Kim Goodwin',
            status: 'Reading',
            note: 'A deep dive into goal-directed design methods. Reframing how I think about user research in resource-constrained contexts.'
        },
        {
            title: 'Weapons of Math Destruction',
            author: 'Cathy O\'Neil',
            status: 'Completed',
            note: 'A sobering look at how algorithms can reinforce inequality — directly relevant to my work on empathetic AI systems.'
        },
        {
            title: 'The Design of Everyday Things',
            author: 'Don Norman',
            status: 'Completed',
            note: 'Foundational thinking on affordances and human-centered design. Keeps me grounded in usability over complexity.'
        }
    ];

    const reflections = [
        {
            date: 'Feb 2026',
            title: 'On Building for Communities You Belong To',
            body: 'There\'s something different about building technology for a community you\'re part of. You carry the context — the language, the constraints, the unspoken needs. The challenge is not losing that intimacy at scale.'
        },
        {
            date: 'Jan 2026',
            title: 'Offline-First as an Equity Strategy',
            body: 'Working on Teachable Machine V3 taught me that "offline-first" isn\'t just a technical pattern — it\'s an access strategy. When connectivity is a privilege, the ability to work without it becomes a form of equity.'
        },
        {
            date: 'Dec 2025',
            title: 'What Ganza Mwari Taught Me About AI',
            body: 'Before I wrote a line of ML code, I sat in rooms with teen mothers learning to sew. That experience didn\'t teach me algorithms — it taught me what empathy looks like when it\'s not a feature but a foundation.'
        }
    ];

    return (
        <section id="books-reflections" className="section container">
            <h2 className="section-title"><span className="section-number">05.</span> Books & Reflections</h2>

            <div className="reveal" ref={revealRef}>
                <div className="br-tabs">
                    <button
                        className={`br-tab ${activeTab === 'books' ? 'active' : ''}`}
                        onClick={() => setActiveTab('books')}
                    >
                        Currently Reading
                    </button>
                    <button
                        className={`br-tab ${activeTab === 'reflections' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reflections')}
                    >
                        Reflections
                    </button>
                </div>

                {activeTab === 'books' && (
                    <div className="br-panel">
                        <div className="books-grid">
                            {books.map((book, i) => (
                                <div key={i} className="book-card reveal-child">
                                    <div className="book-status-badge" data-status={book.status.toLowerCase()}>
                                        {book.status}
                                    </div>
                                    <h4 className="book-title">{book.title}</h4>
                                    <p className="book-author">{book.author}</p>
                                    <p className="book-note">{book.note}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'reflections' && (
                    <div className="br-panel">
                        <div className="reflections-list">
                            {reflections.map((r, i) => (
                                <div key={i} className="reflection-card reveal-child">
                                    <span className="reflection-date">{r.date}</span>
                                    <h4 className="reflection-title">{r.title}</h4>
                                    <p className="reflection-body">{r.body}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default BooksReflections;
