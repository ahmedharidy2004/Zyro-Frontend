import { Link } from "react-router-dom";
import "./GameCard.css";

type GameCardProps = {
    id: string;
    title: string;
    genre: string;
    price: number;
    image: string;
    className?: string;
};

function GameCard({
    id,
    title,
    genre,
    price,
    image,
    className = ""
}: GameCardProps) {
    return (
        <Link to={`/game/${id}`} className={`game-card ${className}`}>
            <img
                src={image}
                alt={title}
                className="GameCardImage"
            />

            <h2>{title}</h2>
            <p>{genre}</p>
            <p>${price}</p>
        </Link>
    );
}

export default GameCard;