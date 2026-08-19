import type { Game } from "../types/game";

const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:5183/api").replace(/\/+$/, "");

export async function getGames(): Promise<Game[]> {
    const response = await fetch(`${API_URL}/Games`);

    if (!response.ok) {
        throw new Error(`Failed to fetch games: ${response.status}`);
    }

    return response.json();
}