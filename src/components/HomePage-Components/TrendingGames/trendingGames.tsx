import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GameCard from "../../Reusable-Components/GameCard/GameCard";
import { getGames } from "../../../services/api";
import type { Game } from "../../../types/game";
import "./trendingGames.css";

function TrendingGames() {
	const [games, setGames] = useState<Game[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		async function loadGames() {
			try {
				const data = await getGames();
				setGames(data.slice(0, 5));
			} catch {
				setError("Failed to load trending games");
			} finally {
				setLoading(false);
			}
		}

		loadGames();
	}, []);

	return (
		<section className="trending-games" aria-labelledby="trending-games-heading">
			<div className="trending-games__header">
				<div>
					<p className="trending-games__eyebrow">Trending now</p>
					<h2 id="trending-games-heading">Popular games</h2>
				</div>
				<Link to="/games" className="trending-games__browse-link">
					Browse all games
					<span aria-hidden="true">-&gt;</span>
				</Link>
			</div>

			{loading && <p className="trending-games__status">Loading games...</p>}
			{error && <p className="trending-games__status">{error}</p>}

			{!loading && !error && (
				<div className="trending-games__grid">
					{games.map((game) => (
						<GameCard
							id={game.id}
							key={game.id}
							title={game.name}
							genre={game.genre}
							price={game.price}
							image={game.imageURL}
						/>
					))}
				</div>
			)}
		</section>
	);
}

export default TrendingGames;
