export interface User {
	id: string;
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
