import useScrollReveal from '../hooks/useScrollReveal';
import './Footer.css';

const Footer = () => {
    const revealRef = useScrollReveal();

    return (
        <footer id="contact" className="footer">
            <div className="container footer-inner reveal" ref={revealRef}>
                <p className="footer-overline"><span className="accent">//</span> What&apos;s Next?</p>
                <h2 className="footer-heading">Get In Touch</h2>
                <p className="footer-text">
                    I'm looking for new opportunities. Whether you have a question
                    or just want to say hi — my inbox is open.
                </p>
                <a href="mailto:lrwagatare@westmont.edu" className="btn-primary">
                    Say Hello
                </a>

                <div className="footer-links">
                    <a href="https://www.linkedin.com/in/rwagatare-livingstone-1288a014a/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                    </a>
                    <a href="mailto:lrwagatare@westmont.edu" aria-label="Email">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </a>
                </div>

                <p className="footer-credit">Designed & Built by Livingstone Rwagatare</p>
            </div>
        </footer>
    );
};

export default Footer;
