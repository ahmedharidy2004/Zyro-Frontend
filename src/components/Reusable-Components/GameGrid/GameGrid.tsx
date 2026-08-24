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
    const [selectedPrice, setSelectedPrice] = useState("all");

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
        const matchesGenre = selectedGenre === "all" || game.genre === selectedGenre;
        const matchesPrice =
            selectedPrice === "all" ||
            (selectedPrice === "under-20" && game.price < 20) ||
            (selectedPrice === "20-40" && game.price >= 20 && game.price <= 40) ||
            (selectedPrice === "over-40" && game.price > 40);

        return matchesGenre && matchesPrice;
    });

    if (loading) {
        return <p>Loading games...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <section className="games-section" aria-labelledby="games-heading">
            <div className="games-header">
                <h1 id="games-heading">Games</h1>
                <div className="games-filters" aria-label="Filter games">
                    <label>
                        Genre
                        <select value={selectedGenre} onChange={(event) => setSelectedGenre(event.target.value)}>
                            <option value="all">All genres</option>
                            {genres.map((genre) => (
                                <option key={genre} value={genre}>{genre}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Price
                        <select value={selectedPrice} onChange={(event) => setSelectedPrice(event.target.value)}>
                            <option value="all">Any price</option>
                            <option value="under-20">Under $20</option>
                            <option value="20-40">$20 - $40</option>
                            <option value="over-40">Over $40</option>
                        </select>
                    </label>
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
                            image={game.imageURL}
                        />
                    ))}
                </div>
            ) : (
                <p className="games-empty">No games match these filters.</p>
            )}
        </section>
    );
}

export default GameGrid;