import { useEffect, useState } from "react";
import GameCard from "../GameCard/GameCard";
import type { Game } from "../../../types/game";
import { getGames } from "../../../services/api";
import "./GameGrid.css";

function GameGrid() {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    if (loading) {
        return <p>Loading games...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="game-grid">
            {games.map((game) => (
                <GameCard
                    title={game.name}
                    genre={game.genre}
                    price={game.price}
                    image={game.imageURL}
                />
            ))}
        </div>
    );
}

export default GameGrid;