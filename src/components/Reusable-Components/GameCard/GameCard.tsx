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
    const discountPercentage = hasDiscount && discountRate < 1 
        ? Math.round((1 - discountRate) * 100) 
        : (hasDiscount && discountRate > 1 ? Math.round(discountRate) : null);

    return (
        <Link to={`/game/${id}`} className={`game-card ${className}`}>
            <div className="game-card__image-wrap">
                <img
                    src={image}
                    alt={title}
                    className="GameCardImage"
                />
                {hasDiscount && (
                    <span className="game-card__discount-badge">
                        {discountPercentage ? `-${discountPercentage}%` : "SALE"}
                    </span>
                )}
            </div>

            <h2>{title}</h2>
            <p>{genre}</p>
            <p className="game-card__pricing">
                {hasDiscount ? (
                    <>
                        <span className="game-card__old-price">${price.toFixed(2)}</span>{" "}
                        <span className="game-card__sale-price">${(price * discountRate).toFixed(2)}</span>
                    </>
                ) : (
                    `$${price.toFixed(2)}`
                )}
            </p>
        </Link>
    );
}

export default GameCard;