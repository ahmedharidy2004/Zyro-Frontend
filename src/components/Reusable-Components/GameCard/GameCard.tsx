import { Link } from "react-router-dom";
import "./GameCard.css";

type GameCardProps = {
    id: string;
    title: string;
    genre: string;
    price: number;
    hasDiscount: boolean;
    discountRate: number;
    image: string;
    className?: string;
};

function GameCard({
    id,
    title,
    genre,
    price,
    hasDiscount,
    discountRate,
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
            <p>
                {hasDiscount ? (
                    <>
                        <span className="game-card__old-price">${price.toFixed(2)}</span>{" "}
                        <span>${(price * discountRate).toFixed(2)}</span>
                    </>
                ) : (
                    `$${price.toFixed(2)}`
                )}
            </p>
        </Link>
    );
}

export default GameCard;