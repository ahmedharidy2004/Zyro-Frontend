import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import games1 from "../../../assets/slider/games1.jpg";
import games2 from "../../../assets/slider/games2.jpg";
import games3 from "../../../assets/slider/games3.jpg";
import games4 from "../../../assets/slider/games4.jpg";
import "./Hero.css";

const sliderImages = [games1, games2, games3, games4];

function Hero() {
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setActiveSlide((currentSlide) => (currentSlide + 1) % sliderImages.length);
        }, 5000);

        return () => window.clearInterval(intervalId);
    }, []);

    return (
        <section className="hero">
            <div className="hero-background" aria-hidden="true">
                {sliderImages.map((image, index) => (
                    <div
                        className={`hero-background-slide${index === activeSlide ? " is-active" : ""}`}
                        key={image}
                        style={{ backgroundImage: `url(${image})` }}
                    />
                ))}
            </div>
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