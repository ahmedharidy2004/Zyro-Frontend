import type { Game } from "../types/game";
import type { login } from "../types/loginInfo";
import type { News } from "../types/news";
import type { signup } from "../types/registerInfo";
import type { Review } from "../types/review";
import type { User } from "../types/user";

const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:5183/api").replace(/\/+$/, "");

function getStoredAuth() {
    try {
        const storedData = localStorage.getItem("zyroUser");
        const storedUser = storedData ? JSON.parse(storedData) : null;

        return {
            token: storedUser?.token ?? null,
            user: storedUser?.user ?? storedUser,
        };
    } catch {
        return { token: null, user: null };
    }
}

///////////////////////////////////////////////////////////////////////////////////////

export async function getGames(): Promise<Game[]> {
    const response = await fetch(`${API_URL}/Games`);

    if (!response.ok) {
        throw new Error(`Failed to fetch games: ${response.status}`);
    }

    return response.json();
}

///////////////////////////////////////////////////////////////////////////////////////

export async function searchGames(query: string): Promise<Game[]> {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
        return [];
    }

    const allGames = await getGames();
    return allGames.filter((game) =>
        game.name.toLowerCase().includes(trimmed) ||
        game.genre.toLowerCase().includes(trimmed) ||
        (game.description && game.description.toLowerCase().includes(trimmed))
    );
}

///////////////////////////////////////////////////////////////////////////////////////
export async function getGame(id: string): Promise<Game> {
    const response = await fetch(`${API_URL}/Games/${encodeURIComponent(id)}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch game: ${response.status}`);
    }

    return response.json();
}

//////////////////////////////////////////////////////////////////////////////////////

export interface GameAverageRating {
    gameId: string;
    averageRating: number;
    reviewCount: number;
}

export async function getGameAvgRating(id: string): Promise<GameAverageRating> {
    const response = await fetch(`${API_URL}/Games/${encodeURIComponent(id)}/rating`);

    if (!response.ok) {
        throw new Error(`Failed to fetch game rating: ${response.status}`);
    }

    return response.json();
}

//////////////////////////////////////////////////////////////////////////////////////

export async function getNews(): Promise<News[]> {
    const response = await fetch(`${API_URL}/News`);

    if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.status}`);
    }

    return response.json();
}

//////////////////////////////////////////////////////////////////////////////////////

export async function getNewsById(id: string): Promise<News> {
    const response = await fetch(`${API_URL}/News/${encodeURIComponent(id)}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.status}`);
    }

    return response.json();
}

//////////////////////////////////////////////////////////////////////////////////////

export async function getReviewsByGameId(gameId: string): Promise<Review[]> {
    const response = await fetch(
        `${API_URL}/Review/game/${encodeURIComponent(gameId)}`
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch reviews: ${response.status}`);
    }

    return response.json();
}

///////////////////////////////////////////////////////////////////////////////////////

export interface CreateReviewInfo {
    rating: number;
    comment: string;
    gameId: string;
}

export async function createReview(
    reviewInfo: CreateReviewInfo
): Promise<Review> {
    const { token } = getStoredAuth();

    const response = await fetch(`${API_URL}/Review`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(reviewInfo),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null) as { message?: string } | null;
        throw new Error(error?.message ?? `Review creation failed: ${response.status}`);
    }

    return response.json();
}

///////////////////////////////////////////////////////////////////////////////////////

export interface UpdateReviewInfo {
    rating: number;
    comment: string;
}

export async function updateReview(
    id: string,
    reviewInfo: UpdateReviewInfo
): Promise<void> {
    const { token } = getStoredAuth();

    const response = await fetch(`${API_URL}/Review/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(reviewInfo),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null) as { message?: string } | null;
        throw new Error(error?.message ?? `Review update failed: ${response.status}`);
    }
}

///////////////////////////////////////////////////////////////////////////////////////

export async function deleteReview(id: string): Promise<void> {
    const { token } = getStoredAuth();

    const response = await fetch(`${API_URL}/Review/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null) as { message?: string } | null;
        throw new Error(error?.message ?? `Review deletion failed: ${response.status}`);
    }
}

//////////////////////////////////////////////////////////////////////////////////////

export type RegisteredUser = {
    token: string;
    user?: Pick<User, "id" | "name" | "username" | "email" | "role">;
    id?: string;
    name?: string;
    username?: string;
    email?: string;
    role?: string;
};

export async function registerUser(registerInfo: signup): Promise<RegisteredUser> {
    const response = await fetch(`${API_URL}/Auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(registerInfo),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null) as { message?: string } | null;
        throw new Error(error?.message ?? `Registration failed: ${response.status}`);
    }

    return response.json();
}

///////////////////////////////////////////////////////////////////////////////////////

type LoginUser = {
    token: string;
    user: Pick<User, "id" | "name" | "username" | "email" | "role">;
};
export async function logInUser(loginInfo: login): Promise<LoginUser> {
    const response = await fetch(`${API_URL}/Auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo)
    });

    if(!response.ok){
        const error = await response.json().catch(() => null) as { message?: string } | null;
        throw new Error(error?.message ?? `Login failed: ${response.status}`);
    }

     return response.json();
}

///////////////////////////////////////////////////////////////////////////////////////

export interface ChangePasswordInfo {
    currentPassword: string,
    newPassword: string,
    ConfirmPassword: string
}

export async function changePassword(changePasswordInfo: ChangePasswordInfo): Promise<void> {
    const storedData = localStorage.getItem("zyroUser");
    const token = storedData ? JSON.parse(storedData).token : null;
    const response = await fetch(`${API_URL}/Auth/change-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(changePasswordInfo)
    });

    if(!response.ok){
        const error = await response.json().catch(() => null) as { message?: string } | null;
        throw new Error(error?.message ?? `Change Password failed: ${response.status}`);
    }

    if (response.status !== 204) {
        await response.json().catch(() => null);
    }
}

//////////////////////////////////////////////////////////////////////////////////////////

export interface ForgetPasswordInfo {
    email: string;
}

export async function forgetPassword(
    forgetPasswordInfo: ForgetPasswordInfo
): Promise<string> {
    const response = await fetch(`${API_URL}/Auth/forget-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(forgetPasswordInfo),
    });

    const message = await response.text();

    if (!response.ok) {
        throw new Error(message || `Password reset request failed: ${response.status}`);
    }

    return message;
}

export interface ResetPasswordInfo {
    newPassword: string;
}

export async function resetPassword(
    userId: string,
    token: string,
    resetPasswordInfo: ResetPasswordInfo
): Promise<string> {
    const response = await fetch(
        `${API_URL}/Auth/reset-password/${encodeURIComponent(userId)}/${encodeURIComponent(token)}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(resetPasswordInfo),
        }
    );

    const message = await response.text();

    if (!response.ok) {
        throw new Error(message || `Password reset failed: ${response.status}`);
    }

    return message;
}

//////////////////////////////////////////////////////////////////////////////////////////

export interface UpdateUserInfo {
    name?: string;
    username: string;
    email: string;
    role: string;
}

export async function updateUser(
    id: string,
    userInfo: UpdateUserInfo
): Promise<void> {
    const storedData = localStorage.getItem("zyroUser");
    const token = storedData ? JSON.parse(storedData).token : null;

    const response = await fetch(`${API_URL}/User/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(userInfo),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null) as {
            message?: string;
        } | null;

        throw new Error(
            error?.message ?? `User update failed: ${response.status}`
        );
    }
}

/////////////////////////////////////////////////////////////////////////////////////

export interface CartItem {
    id: string;
    gameId: string;
    gameName: string;
    imageURL?: string;
    price: number;
    quantity: number;
}

export interface Cart {
    id: string;
    userId: string;
    items: CartItem[];
}

export interface AddCartItemInfo {
    gameId: string;
    quantity: number;
}

export interface OrderItem {
    id: string;
    orderId?: string;
    gameId: string;
    gameName: string;
    quantity: number;
    unitPrice: number;
}

export interface Order {
    id: string;
    userId: string;
    paymentMethod: number | string;
    totalPrice: number;
    items: OrderItem[];
}

export interface CreateOrderInfo {
    paymentMethod: number | string;
}

////////////////////////////////////////////////////////////////////////////////////

export async function getOrdersByUserId(): Promise<Order[]> {
    const { token } = getStoredAuth();

    const response = await fetch(`${API_URL}/Order/my-orders`, {
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null) as { message?: string } | null;
        throw new Error(error?.message ?? `Orders fetch failed: ${response.status}`);
    }

    return response.json();
}

////////////////////////////////////////////////////////////////////////////////////

export async function createOrder(
    orderInfo: CreateOrderInfo
): Promise<Order> {
    const { token } = getStoredAuth();

    const response = await fetch(`${API_URL}/Order/me`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(orderInfo),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null) as { message?: string } | null;
        throw new Error(error?.message ?? `Order creation failed: ${response.status}`);
    }

    return response.json();
}

////////////////////////////////////////////////////////////////////////////////////

export async function cancelOrder(id: string): Promise<void> {
    const { token } = getStoredAuth();

    const response = await fetch(`${API_URL}/Order/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => null) as { message?: string } | string | null;
        const message = typeof errorBody === "string" ? errorBody : errorBody?.message;
        throw new Error(message ?? `Order cancellation failed: ${response.status}`);
    }
}

////////////////////////////////////////////////////////////////////////////////////

export async function getCart(): Promise<Cart> {
    const { token } = getStoredAuth();

    const response = await fetch(`${API_URL}/Cart/my-cart`, {
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null) as { message?: string } | null;
        throw new Error(error?.message ?? `Cart fetch failed: ${response.status}`);
    }

    const cart = await response.json() as Cart;
    const items = await Promise.all(cart.items.map(async (item) => {
        try {
            const game = await getGame(item.gameId);
            return { ...item, imageURL: game.imageURL };
        } catch {
            return item;
        }
    }));

    return { ...cart, items };
}

////////////////////////////////////////////////////////////////////////////////////

export async function getCartItems(): Promise<CartItem[]> {
    const cart = await getCart();
    return cart.items;
}

////////////////////////////////////////////////////////////////////////////////////

export async function addCartItem(
    cartItemInfo: AddCartItemInfo
): Promise<CartItem> {
    const { token } = getStoredAuth();

    const response = await fetch(`${API_URL}/Cart/me/items`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(cartItemInfo),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null) as { message?: string } | null;
        throw new Error(error?.message ?? `Cart item creation failed: ${response.status}`);
    }

    return response.json();
}

////////////////////////////////////////////////////////////////////////////////////

export async function deleteCartItem(itemId: string): Promise<void> {
    const { token } = getStoredAuth();

    const response = await fetch(`${API_URL}/Cart/me/items/${encodeURIComponent(itemId)}`, {
        method: "DELETE",
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null) as { message?: string } | null;
        throw new Error(error?.message ?? `Cart item deletion failed: ${response.status}`);
    }
}

////////////////////////////////////////////////////////////////////////////////////
