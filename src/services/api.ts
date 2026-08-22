import type { Game } from "../types/game";
import type { login } from "../types/loginInfo";
import type { signup } from "../types/registerInfo";
import type { User } from "../types/user";

const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:5183/api").replace(/\/+$/, "");

///////////////////////////////////////////////////////////////////////////////////////

export async function getGames(): Promise<Game[]> {
    const response = await fetch(`${API_URL}/Games`);

    if (!response.ok) {
        throw new Error(`Failed to fetch games: ${response.status}`);
    }

    return response.json();
}

///////////////////////////////////////////////////////////////////////////////////////

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

type LoginUser = Pick<User, "id" | "username" | "email" | "role">;
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