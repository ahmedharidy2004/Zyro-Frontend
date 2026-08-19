import { Link } from "react-router-dom";
import bgImage from "./../../../assets/welcomesection.png";
import "./Hero.css";

function Hero() {
    return (
        <section
            className="hero"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            <div className="hero-overlay" />

            <div className="hero-content">
                <h1 className="hero-title">
                    PLAY.
                    <br />
                    BUY.
                    <br />
                    <span className="highlight">WIN.</span>
                </h1>

                <p className="hero-subtitle">
                    Your ultimate destination for PC games.
                    <br />
                    Great prices. Instant delivery. Endless fun.
                </p>

                <div className="hero-actions">
                    <Link to="/games" className="btn btn-primary">
                        Browse Games
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M5 12h14M13 6l6 6-6 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </Link>

                    <Link to="/deals" className="btn btn-secondary">
                        Explore Deals
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default Hero;