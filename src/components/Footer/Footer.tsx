import "./Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-heading">
                    <span className="line" />
                    <h2>FOLLOW US ON :</h2>
                    <span className="line" />
                </div>

                <div className="footer-socials">
                    <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon"
                        aria-label="Facebook"
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.5 21v-7.5h2.5l.4-3H13.5V8.5c0-.87.24-1.46 1.5-1.46h1.6V4.36C16.3 4.25 15.4 4.16 14.36 4.16c-2.24 0-3.77 1.37-3.77 3.88V10.5H8.1v3h2.49V21h2.91Z" />
                        </svg>
                    </a>

                    <a
                        href="https://youtube.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon"
                        aria-label="YouTube"
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="m10 15 5.2-3-5.2-3v6Zm11.6-8.42c.24.9.4 2.1.4 3.42v1.9c0 1.32-.16 2.52-.4 3.42-.24.87-.9 1.5-1.75 1.7C18.4 17.5 12 17.5 12 17.5s-6.4 0-7.85-.48a2.3 2.3 0 0 1-1.75-1.7C2.16 14.52 2 13.32 2 12v-1.9c0-1.32.16-2.52.4-3.42.24-.87.9-1.52 1.75-1.72C5.6 4.5 12 4.5 12 4.5s6.4 0 7.85.46c.85.2 1.5.85 1.75 1.72Z" />
                        </svg>
                    </a>

                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon"
                        aria-label="Instagram"
                    >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="1.6" />
                            <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.6" />
                            <circle cx="16.4" cy="7.6" r="0.9" fill="currentColor" />
                        </svg>
                    </a>
                </div>

                <div className="footer-divider">
                    <span className="footer-divider-dot" />
                </div>

                <p className="footer-copy">ALL RIGHTS RECEIVED @ZYRO</p>
            </div>
        </footer>
    );
}

export default Footer;