import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import GameCard from "../GameCard/GameCard";
import type { Game } from "../../../types/game";
import { getGames } from "../../../services/api";
import "./GameGrid.css";

const GAMES_PER_PAGE = 10;

function GameGrid() {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("all");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [hasDiscountOnly, setHasDiscountOnly] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();

    const searchQuery = searchParams.get("search") || "";

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

    const filteredGames = useMemo(() => {
        return games.filter((game) => {
            // Search query filter
            const trimmedSearch = searchQuery.trim().toLowerCase();
            const matchesSearch =
                !trimmedSearch ||
                game.name.toLowerCase().includes(trimmedSearch) ||
                game.genre.toLowerCase().includes(trimmedSearch) ||
                (game.description && game.description.toLowerCase().includes(trimmedSearch));

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

            return matchesSearch && matchesGenre && matchesMinPrice && matchesMaxPrice && matchesDiscount;
        });
    }, [games, searchQuery, selectedGenre, minPrice, maxPrice, hasDiscountOnly]);

    // Reset current page to 1 whenever filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedGenre, minPrice, maxPrice, hasDiscountOnly]);

    const totalPages = Math.ceil(filteredGames.length / GAMES_PER_PAGE);

    const paginatedGames = useMemo(() => {
        const startIndex = (currentPage - 1) * GAMES_PER_PAGE;
        return filteredGames.slice(startIndex, startIndex + GAMES_PER_PAGE);
    }, [filteredGames, currentPage]);

    const isFiltered = searchQuery.trim() !== "" || selectedGenre !== "all" || minPrice !== "" || maxPrice !== "" || hasDiscountOnly;

    const resetFilters = () => {
        setSelectedGenre("all");
        setMinPrice("");
        setMaxPrice("");
        setHasDiscountOnly(false);
        setCurrentPage(1);
        if (searchQuery) {
            searchParams.delete("search");
            setSearchParams(searchParams);
        }
    };

    const clearSearch = () => {
        searchParams.delete("search");
        setSearchParams(searchParams);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
            setCurrentPage(newPage);
            const section = document.getElementById("games-heading");
            if (section) {
                section.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    };

    const getPageNumbers = () => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        if (currentPage <= 4) {
            return [1, 2, 3, 4, 5, "...", totalPages];
        }
        if (currentPage >= totalPages - 3) {
            return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        }
        return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
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

    const startCount = filteredGames.length === 0 ? 0 : (currentPage - 1) * GAMES_PER_PAGE + 1;
    const endCount = Math.min(currentPage * GAMES_PER_PAGE, filteredGames.length);

    return (
        <section className="games-section" aria-labelledby="games-heading">
            <div className="games-header">
                <div className="games-title-wrap">
                    <h1 id="games-heading">Games</h1>
                    <div className="games-meta">
                        <span className="games-count">
                            Showing {filteredGames.length > 0 ? `${startCount}–${endCount} of ${filteredGames.length}` : "0"} {filteredGames.length === 1 ? "game" : "games"}
                        </span>
                        {searchQuery.trim() && (
                            <div className="search-query-tag">
                                <span>Search: <strong>"{searchQuery.trim()}"</strong></span>
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="clear-search-tag-btn"
                                    aria-label="Clear search"
                                    title="Clear search"
                                >
                                    &times;
                                </button>
                            </div>
                        )}
                    </div>
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

            {paginatedGames.length > 0 ? (
                <>
                    <div className="game-grid">
                        {paginatedGames.map((game) => (
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

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <nav className="games-pagination" aria-label="Games pagination">
                            <button
                                type="button"
                                className="pagination-nav-btn pagination-prev"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                aria-label="Go to previous page"
                            >
                                &larr; Prev
                            </button>

                            <div className="pagination-pages">
                                {getPageNumbers().map((item, index) =>
                                    typeof item === "number" ? (
                                        <button
                                            key={index}
                                            type="button"
                                            className={`pagination-page-btn ${currentPage === item ? "active" : ""}`}
                                            onClick={() => handlePageChange(item)}
                                            aria-current={currentPage === item ? "page" : undefined}
                                        >
                                            {item}
                                        </button>
                                    ) : (
                                        <span key={index} className="pagination-ellipsis">
                                            {item}
                                        </span>
                                    )
                                )}
                            </div>

                            <button
                                type="button"
                                className="pagination-nav-btn pagination-next"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                aria-label="Go to next page"
                            >
                                Next &rarr;
                            </button>
                        </nav>
                    )}
                </>
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