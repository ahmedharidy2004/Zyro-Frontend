export interface Game {
    id: string;
    name: string;
    imageURL: string;
    trailerURL: string;
    price: number;
    hasDiscount: boolean;
    discountRate: number;
    genre: string;
    releaseDate: string;
    description: string;
}