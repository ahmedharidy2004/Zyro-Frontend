import type { Game } from "../types/game";
import type { login } from "../types/loginInfo";
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
export async function getGame(id: string): Promise<Game> {
    const response = await fetch(`${API_URL}/Games/${encodeURIComponent(id)}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch game: ${response.status}`);
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

type RegisteredUser = Pick<User, "id" | "username" | "email" | "role">;

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
    user: Pick<User, "id" | "username" | "email" | "role">;
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
