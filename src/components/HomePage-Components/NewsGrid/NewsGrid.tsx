import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNews } from "../../../services/api";
import type { News } from "../../../types/news";
import Navbar from "../../Reusable-Components/Navbar/Navbar";
import Footer from "../../Reusable-Components/Footer/Footer";
import "./NewsGrid.css";

function getNewsDate(news: News) {
    return new Date(news.publishedAt ?? news.createdAt).getTime();
}

function formatDate(value: string | null) {
    if (!value) return "Unpublished";

    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(value));
}

function NewsGrid() {
    const [news, setNews] = useState<News[]>([]);
    const [activeSlide, setActiveSlide] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadNews() {
            try {
                const data = await getNews();
                setNews([...data].sort((first, second) => getNewsDate(second) - getNewsDate(first)));
            } catch {
                setError("Failed to load news");
            } finally {
                setLoading(false);
            }
        }

        loadNews();
    }, []);

    const recentNews = news.slice(0, 5);
    const activeNews = recentNews[activeSlide];

    return (
        <div className="news-page">
            <Navbar />
            <main>
                <section className="news-grid-hero" aria-labelledby="news-heading">
                    <div className="news-grid-hero__intro">
                        <p className="news-grid__eyebrow">The latest from Zyro</p>
                        <h1 id="news-heading">News &amp; stories</h1>
                        <p>Fresh releases, gaming culture, and everything happening in our world.</p>
                    </div>

                    {loading && <p className="news-grid__status">Loading news...</p>}
                    {error && <p className="news-grid__status">{error}</p>}

                    {!loading && !error && recentNews.length > 0 && (
                        <div className="news-slider" aria-label="Recent news">
                            <Link to={`/news/${activeNews.id}`} className="news-slider__feature">
                                <img src={activeNews.coverURL} alt="" />
                                <div className="news-slider__overlay" />
                                <div className="news-slider__content">
                                    <span>{formatDate(activeNews.publishedAt)}</span>
                                    <h2>{activeNews.title}</h2>
                                    <strong>Read story <span aria-hidden="true">-&gt;</span></strong>
                                </div>
                            </Link>
                            <div className="news-slider__controls">
                                {recentNews.map((item, index) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        className={index === activeSlide ? "is-active" : ""}
                                        onClick={() => setActiveSlide(index)}
                                        aria-label={`Show story ${index + 1}: ${item.title}`}
                                        aria-pressed={index === activeSlide}
                                    >
                                        <span>{String(index + 1).padStart(2, "0")}</span>
                                        <span>{item.title}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {!loading && !error && news.length === 0 && (
                        <p className="news-grid__status">No news is available yet.</p>
                    )}
                </section>

                {!loading && !error && news.length > 0 && (
                    <section className="discover-news" aria-labelledby="discover-news-heading">
                        <div className="discover-news__header">
                            <div>
                                <p className="news-grid__eyebrow">Keep exploring</p>
                                <h2 id="discover-news-heading">Discover news</h2>
                            </div>
                            <span>{news.length} stories</span>
                        </div>
                        <div className="discover-news__grid">
                            {news.map((item) => (
                                <Link to={`/news/${item.id}`} className="news-card" key={item.id}>
                                    <div className="news-card__image-wrap">
                                        <img src={item.coverURL} alt="" className="news-card__image" />
                                        <span className="news-card__arrow" aria-hidden="true">-&gt;</span>
                                    </div>
                                    <p>{formatDate(item.publishedAt)}</p>
                                    <h3>{item.title}</h3>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default NewsGrid;
