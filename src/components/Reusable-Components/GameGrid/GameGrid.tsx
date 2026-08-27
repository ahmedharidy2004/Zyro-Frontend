import { useEffect, useMemo, useState } from "react";
import GameCard from "../GameCard/GameCard";
import type { Game } from "../../../types/game";
import { getGames } from "../../../services/api";
import "./GameGrid.css";

function GameGrid() {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("all");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [hasDiscountOnly, setHasDiscountOnly] = useState(false);

    useEffect(() => {
        async function loadGames() {
            try {
                const data = await getGames();
                setGames(data);
            } catch {
                setError("Failed to load games");
            } finally {
                setLoading(false);
            }
        }

        loadGames();
    }, []);

    const genres = useMemo(
        () => [...new Set(games.map((game) => game.genre))].sort(),
        [games]
    );

    const filteredGames = games.filter((game) => {
        // Genre filter
        const matchesGenre = selectedGenre === "all" || game.genre === selectedGenre;

        // Price calculations (effective sale price if discounted)
        const finalPrice = game.hasDiscount ? Number((game.price * game.discountRate).toFixed(2)) : game.price;

        const min = minPrice !== "" ? parseFloat(minPrice) : null;
        const max = maxPrice !== "" ? parseFloat(maxPrice) : null;

        const matchesMinPrice = min === null || isNaN(min) || finalPrice >= min;
        const matchesMaxPrice = max === null || isNaN(max) || finalPrice <= max;

        // Has discount filter
        const matchesDiscount = !hasDiscountOnly || Boolean(game.hasDiscount);

        return matchesGenre && matchesMinPrice && matchesMaxPrice && matchesDiscount;
    });

    const isFiltered = selectedGenre !== "all" || minPrice !== "" || maxPrice !== "" || hasDiscountOnly;

    const resetFilters = () => {
        setSelectedGenre("all");
        setMinPrice("");
        setMaxPrice("");
        setHasDiscountOnly(false);
    };

    if (loading) {
        return (
            <section className="games-section">
                <div className="games-loading-wrap">
                    <p>Loading games...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="games-section">
                <div className="games-error-wrap">
                    <p>{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="games-section" aria-labelledby="games-heading">
            <div className="games-header">
                <div className="games-title-wrap">
                    <h1 id="games-heading">Games</h1>
                    <span className="games-count">
                        Showing {filteredGames.length} {filteredGames.length === 1 ? "game" : "games"}
                    </span>
                </div>

                <div className="games-filters" aria-label="Filter games">
                    {/* Genre Filter */}
                    <div className="filter-group">
                        <label htmlFor="genre-select" className="filter-label">Genre</label>
                        <select
                            id="genre-select"
                            value={selectedGenre}
                            onChange={(event) => setSelectedGenre(event.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All genres</option>
                            {genres.map((genre) => (
                                <option key={genre} value={genre}>{genre}</option>
                            ))}
                        </select>
                    </div>

                    {/* Price Range Filter */}
                    <div className="filter-group filter-price-group">
                        <span className="filter-label">Price Range ($)</span>
                        <div className="price-inputs">
                            <input
                                type="number"
                                min="0"
                                step="any"
                                placeholder="Min"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="filter-price-input"
                                aria-label="Minimum price"
                            />
                            <span className="price-separator">-</span>
                            <input
                                type="number"
                                min="0"
                                step="any"
                                placeholder="Max"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="filter-price-input"
                                aria-label="Maximum price"
                            />
                        </div>
                    </div>

                    {/* Has Discount Filter */}
                    <div className="filter-group filter-checkbox-group">
                        <span className="filter-label">Discount</span>
                        <label className="filter-checkbox-label">
                            <input
                                type="checkbox"
                                checked={hasDiscountOnly}
                                onChange={(e) => setHasDiscountOnly(e.target.checked)}
                                className="filter-checkbox"
                            />
                            <span className="checkbox-custom"></span>
                            <span className="checkbox-text">Has Discount</span>
                        </label>
                    </div>

                    {/* Reset Button */}
                    {isFiltered && (
                        <div className="filter-group filter-reset-group">
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="filter-reset-btn"
                                title="Reset all filters"
                            >
                                Reset
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {filteredGames.length > 0 ? (
                <div className="game-grid">
                    {filteredGames.map((game) => (
                        <GameCard
                            key={game.id}
                            id={game.id}
                            title={game.name}
                            genre={game.genre}
                            price={game.price}
                            hasDiscount={game.hasDiscount}
                            discountRate={game.discountRate}
                            image={game.imageURL}
                        />
                    ))}
                </div>
            ) : (
                <div className="games-empty-container">
                    <p className="games-empty">No games match these filters.</p>
                    {isFiltered && (
                        <button type="button" onClick={resetFilters} className="games-empty-reset">
                            Clear filters
                        </button>
                    )}
                </div>
            )}
        </section>
    );
}

export default GameGrid;