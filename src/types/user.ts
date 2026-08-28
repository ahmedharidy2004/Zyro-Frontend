export interface User {
	id: string;
	name?: string;
	username: string;
	email: string;
	passwordHash: string;
	role: string;
	resetToken: string;
	resetTokenExpiresAt: string;
	createdAt: string;
	updatedAt: string;
	orders: unknown[];
	cart: unknown | null;
	reviews: unknown[];
}
