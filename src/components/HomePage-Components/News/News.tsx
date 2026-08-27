import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getNewsById } from "../../../services/api";
import type { News as NewsArticle } from "../../../types/news";
import Navbar from "../../Reusable-Components/Navbar/Navbar";
import Footer from "../../Reusable-Components/Footer/Footer";
import "./News.css";

function formatDate(value: string | null) {
    if (!value) return "Unpublished";

    return new Intl.DateTimeFormat("en", {
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(new Date(value));
}

function News() {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<NewsArticle | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) {
            setError("News article not found");
            setLoading(false);
            return;
        }

        const articleId = id;

        async function loadArticle() {
            try {
                setArticle(await getNewsById(articleId));
            } catch {
                setError("News article not found");
            } finally {
                setLoading(false);
            }
        }

        loadArticle();
    }, [id]);

    return (
        <div className="news-detail-page">
            <Navbar />
            <main>
                {loading && <p className="news-detail__status">Loading story...</p>}
                {error && (
                    <div className="news-detail__status">
                        <p>{error}</p>
                        <Link to="/news">Back to news</Link>
                    </div>
                )}
                {!loading && !error && article && (
                    <article className="news-detail">
                        <Link to="/news" className="news-detail__back">&lt;- Back to news</Link>
                        <header className="news-detail__header">
                            <p className="news-detail__eyebrow">Zyro news</p>
                            <h1>{article.title}</h1>
                            <p className="news-detail__date">Published {formatDate(article.publishedAt)}</p>
                        </header>
                        <img className="news-detail__cover" src={article.coverURL} alt="" />
                        <div className="news-detail__content">{article.content}</div>
                    </article>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default News;
