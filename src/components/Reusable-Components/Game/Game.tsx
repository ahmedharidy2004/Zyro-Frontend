import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    addCartItem,
    createReview,
    deleteReview,
    getGame,
    getGameAvgRating,
    getReviewsByGameId,
    updateReview,
} from "../../../services/api";
import type { Game as GameType } from "../../../types/game";
import type { Review } from "../../../types/review";
import "./Game.css";

function Game() {
    const [game, setGame] = useState<GameType | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [averageRating, setAverageRating] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const [reviewComment, setReviewComment] = useState("");
    const [reviewRating, setReviewRating] = useState(5);
    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [error, setError] = useState("");
    const [reviewError, setReviewError] = useState("");
    const [reviewSuccess, setReviewSuccess] = useState("");
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [cartMessage, setCartMessage] = useState("");
    const [cartError, setCartError] = useState("");
    const { id } = useParams<{ id: string }>();

    function getCurrentUserId() {
        try {
            const storedUser = localStorage.getItem("zyroUser");
            const parsedUser = storedUser ? JSON.parse(storedUser) : null;
            return parsedUser?.user?.id ?? parsedUser?.id ?? null;
        } catch {
            return null;
        }
    }

    useEffect(() => {
        async function fetchGame() {
            if (!id) {
                setError("Game was not found.");
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError("");
                const [gameData, reviewData] = await Promise.all([
                    getGame(id),
                    getReviewsByGameId(id).catch(() => []),
                ]);
                const ratingData = await getGameAvgRating(id).catch(() => ({
                    averageRating: 0,
                    reviewCount: 0,
                }));
                setGame(gameData);
                setReviews(reviewData);
                setAverageRating(ratingData.averageRating);
                setReviewCount(ratingData.reviewCount);
            } catch {
                setError("Unable to load this game.");
            } finally {
                setIsLoading(false);
            }
        }

        fetchGame();
    }, [id]);

    const resetReviewForm = () => {
        setReviewComment("");
        setReviewRating(5);
        setEditingReviewId(null);
    };

    const handleReviewSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!id || !reviewComment.trim()) return;

        setIsSubmittingReview(true);
        setReviewError("");
        setReviewSuccess("");

        try {
            if (editingReviewId) {
                await updateReview(editingReviewId, {
                    rating: reviewRating,
                    comment: reviewComment,
                });
                setReviews((currentReviews) => currentReviews.map((review) =>
                    review.id === editingReviewId
                        ? { ...review, rating: reviewRating, comment: reviewComment.trim(), updatedAt: new Date().toISOString() }
                        : review,
                ));
                setReviewSuccess("Review updated.");
            } else {
                const createdReview = await createReview({
                    rating: reviewRating,
                    comment: reviewComment,
                    gameId: id,
                });
                setReviews((currentReviews) => [createdReview, ...currentReviews]);
                setReviewSuccess("Review posted.");
            }
            resetReviewForm();
        } catch (requestError) {
            setReviewError(
                requestError instanceof Error ? requestError.message : "Unable to save review.",
            );
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        setReviewError("");
        setReviewSuccess("");

        try {
            await deleteReview(reviewId);
            setReviews((currentReviews) => currentReviews.filter((review) => review.id !== reviewId));
            setReviewSuccess("Review deleted.");
            if (editingReviewId === reviewId) resetReviewForm();
        } catch (requestError) {
            setReviewError(
                requestError instanceof Error ? requestError.message : "Unable to delete review.",
            );
        }
    };

    const startEditingReview = (review: Review) => {
        setEditingReviewId(review.id);
        setReviewRating(review.rating);
        setReviewComment(review.comment);
        setReviewError("");
        setReviewSuccess("");
    };

    const handleAddToCart = async () => {
        if (!id) return;

        setIsAddingToCart(true);
        setCartMessage("");
        setCartError("");

        try {
            await addCartItem({ gameId: id, quantity: 1 });
            setCartMessage("Added to cart.");
        } catch (requestError) {
            setCartError(
                requestError instanceof Error ? requestError.message : "Unable to add this game to your cart.",
            );
        } finally {
            setIsAddingToCart(false);
        }
    };

    if (isLoading) {
        return <main className="game-details game-details-state">Loading game...</main>;
    }

    if (error || !game) {
        return <main className="game-details game-details-state">{error || "Game was not found."}</main>;
    }

    return (
        <main className="game-details">
            <section className="game-details__content" aria-labelledby="game-title">
                <div className="game-details__top">
                    <div className="game-details__image-wrap">
                        <img src={game.imageURL} alt={`${game.name} cover`} className="game-details__image" />
                    </div>

                    <div className="game-details__info">
                        <p className="game-details__eyebrow">{game.genre}</p>
                        <h1 id="game-title">{game.name}</h1>
                        <div className="game-details__rating" aria-label={`${averageRating.toFixed(1)} out of 5 average rating`}>
                            <span aria-hidden="true">★</span>
                            <strong>{averageRating.toFixed(1)}</strong>
                            <span>{reviewCount} {reviewCount === 1 ? "review" : "reviews"}</span>
                        </div>
                        <p className="game-details__description">{game.description}</p>
                        <p className="game-details__release-date">Released: {game.releaseDate}</p>
                        <p className="game-details__price">
                            {game.hasDiscount ? (
                                <>
                                    <span className="game-details__old-price">${game.price.toFixed(2)}</span>{" "}
                                    <span>${(game.price * game.discountRate).toFixed(2)}</span>
                                </>
                            ) : (
                                `$${game.price.toFixed(2)}`
                            )}
                        </p>
                        <button
                            className="game-details__button"
                            type="button"
                            onClick={handleAddToCart}
                            disabled={isAddingToCart}
                        >
                            {isAddingToCart ? "Adding..." : "Add to cart"}
                        </button>
                        {cartError && <p className="review-message review-message--error" role="alert">{cartError}</p>}
                        {cartMessage && <p className="review-message" role="status">{cartMessage}</p>}
                    </div>
                </div>

                <div className="game-details__trailer-section">
                    <h2>Watch trailer</h2>
                    <div className="game-details__trailer">
                        <iframe
                            src={game.trailerURL}
                            title={`${game.name} trailer`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            </section>

            <section className="reviews" aria-labelledby="reviews-title">
                <div className="reviews__heading">
                    <p className="game-details__eyebrow">Community notes</p>
                    <h2 id="reviews-title">Reviews</h2>
                    <p>What players think about {game.name}.</p>
                </div>

                <form className="review-form" onSubmit={handleReviewSubmit}>
                    <h3>{editingReviewId ? "Edit your review" : "Leave a review"}</h3>
                    <fieldset className="review-rating">
                        <legend>Rating</legend>
                        <div className="review-rating__stars" aria-label={`${reviewRating} out of 5 stars`}>
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                    className={rating <= reviewRating ? "review-star review-star--active" : "review-star"}
                                    key={rating}
                                    type="button"
                                    aria-label={`${rating} star${rating === 1 ? "" : "s"}`}
                                    aria-pressed={rating === reviewRating}
                                    onClick={() => setReviewRating(rating)}
                                >
                                    ★
                                </button>
                            ))}
                            <span>{reviewRating} / 5</span>
                        </div>
                    </fieldset>
                    <label htmlFor="review-comment">Comment</label>
                    <textarea
                        id="review-comment"
                        value={reviewComment}
                        onChange={(event) => setReviewComment(event.target.value)}
                        placeholder="Share your thoughts..."
                        required
                        rows={4}
                    />
                    <div className="review-form__actions">
                        <button className="game-details__button" type="submit" disabled={isSubmittingReview}>
                            {isSubmittingReview ? "Saving..." : editingReviewId ? "Update review" : "Post review"}
                        </button>
                        {editingReviewId && (
                            <button className="review-action review-action--cancel" type="button" onClick={resetReviewForm}>
                                Cancel
                            </button>
                        )}
                    </div>
                    {reviewError && <p className="review-message review-message--error" role="alert">{reviewError}</p>}
                    {reviewSuccess && <p className="review-message" role="status">{reviewSuccess}</p>}
                </form>

                <div className="reviews__list">
                    {reviews.length === 0 ? (
                        <p className="reviews__empty">No reviews yet. Start the conversation.</p>
                    ) : reviews.map((review) => (
                        <article className="review-card" key={review.id}>
                            <div className="review-card__topline">
                                <div>
                                    <h3>{review.username}</h3>
                                    <p>{review.rating} / 5</p>
                                </div>
                                {review.userId === getCurrentUserId() && (
                                    <div className="review-card__actions">
                                        <button className="review-action" type="button" onClick={() => startEditingReview(review)}>Edit</button>
                                        <button className="review-action review-action--danger" type="button" onClick={() => handleDeleteReview(review.id)}>Delete</button>
                                    </div>
                                )}
                            </div>
                            <p className="review-card__comment">{review.comment}</p>
                            <time dateTime={review.updatedAt}>
                                {new Date(review.updatedAt).toLocaleDateString()}
                            </time>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}

export default Game;