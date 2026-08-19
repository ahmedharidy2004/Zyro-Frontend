import "./GameCard.css";

type GameCardProps = {
    title: string;
    genre: string;
    price: number;
    image: string;
    className?: string;
};

function GameCard({
    title,
    genre,
    price,
    image,
    className = ""
}: GameCardProps) {
    return (
        <div className={`game-card ${className}`}>
            <img
                src={image}
                alt={title}
                className="GameCardImage"
            />

            <h2>{title}</h2>
            <p>{genre}</p>
            <p>${price}</p>
        </div>
    );
}

export default GameCard;