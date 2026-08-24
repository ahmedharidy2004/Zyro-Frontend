import {
	CalendarDays,
	ChevronRight,
	LockKeyhole,
	LogOut,
	Mail,
	Pencil,
	ShoppingBag,
	UserRound,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../../../services/api";
import "./profile.css";

type ProfileProps = {
	id?: string;
	userRole?: string;
	username?: string;
	email?: string;
	memberSince?: string;
	onOrdersClick?: () => void;
	onEditProfileClick?: () => void;
	onChangePasswordClick?: () => void;
	onLogout?: () => void;
};

type ProfileActionProps = {
	icon: React.ReactNode;
	title: string;
	description: string;
	onClick?: () => void;
};

function ProfileAction({ icon, title, description, onClick }: ProfileActionProps) {
	return (
		<button className="profile-action" type="button" onClick={onClick}>
			<span className="profile-action-icon" aria-hidden="true">
				{icon}
			</span>
			<span className="profile-action-copy">
				<strong>{title}</strong>
				<span>{description}</span>
			</span>
			<ChevronRight className="profile-action-chevron" size={20} aria-hidden="true" />
		</button>
	);
}

function Profile({
	id,
	userRole = "User",
	username = "Alex Walker",
	email = "alex.walker@email.com",
	memberSince = "May 2023",
	onOrdersClick,
	onEditProfileClick,
	onChangePasswordClick,
	onLogout,
}: ProfileProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editedUsername, setEditedUsername] = useState(username);
	const [editedEmail, setEditedEmail] = useState(email);
	const [isSaving, setIsSaving] = useState(false);
	const [message, setMessage] = useState("");

	const handleEditProfile = () => {
		setEditedUsername(username);
		setEditedEmail(email);
		setMessage("");
		setIsEditing(true);
		onEditProfileClick?.();
	};

	const handleSaveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!id) {
			setMessage("Unable to update profile: user ID is missing.");
			return;
		}

		try {
			setIsSaving(true);
			setMessage("");
			await updateUser(id, {
				username: editedUsername.trim(),
				email: editedEmail.trim(),
				role: userRole,
			});

			const storedUser = localStorage.getItem("zyroUser");
			if (storedUser) {
				const storedData = JSON.parse(storedUser);
				const updatedData = storedData?.user
					? { ...storedData, user: { ...storedData.user, username: editedUsername.trim(), email: editedEmail.trim() } }
					: { ...storedData, username: editedUsername.trim(), email: editedEmail.trim() };
				localStorage.setItem("zyroUser", JSON.stringify(updatedData));
			}

			setIsEditing(false);
			setMessage("Profile updated successfully.");
		} catch (error) {
			setMessage(error instanceof Error ? error.message : "Failed to update profile.");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<main className="profile-page">
			<header className="profile-page-heading">
				<h1>My Profile</h1>
				<p>Manage your account information and security.</p>
			</header>

			<section className="profile-card" aria-labelledby="profile-name">
				<div className="profile-identity">
					<div className="profile-avatar" aria-hidden="true">
						<UserRound size={54} strokeWidth={1.5} />
					</div>
					<div>
						<h2 id="profile-name">{username}</h2>
						<p className="profile-member-since">
							<CalendarDays size={16} aria-hidden="true" />
							Member since {memberSince}
						</p>
					</div>
				</div>

				<div className="profile-content">
					<h3>Account Information</h3>
					{isEditing ? (
						<form className="profile-edit-form" onSubmit={handleSaveProfile}>
							<label htmlFor="profile-username">Username</label>
							<input
								id="profile-username"
								type="text"
								value={editedUsername}
								onChange={(event) => setEditedUsername(event.target.value)}
								required
							/>

							<label htmlFor="profile-email">Email</label>
							<input
								id="profile-email"
								type="email"
								value={editedEmail}
								onChange={(event) => setEditedEmail(event.target.value)}
								required
							/>

							<div className="profile-edit-actions">
								<button type="submit" disabled={isSaving}>
									{isSaving ? "Saving..." : "Save Changes"}
								</button>
								<button type="button" onClick={() => setIsEditing(false)} disabled={isSaving}>
									Cancel
								</button>
							</div>
						</form>
					) : (
						<div className="profile-details">
						<div className="profile-detail-row">
							<Mail className="profile-detail-icon" size={20} aria-hidden="true" />
							<span className="profile-detail-label">Email</span>
							<span className="profile-detail-value">{email}</span>
						</div>
						<div className="profile-detail-row">
							<UserRound className="profile-detail-icon" size={20} aria-hidden="true" />
							<span className="profile-detail-label">Username</span>
							<span className="profile-detail-value">{username}</span>
						</div>
						</div>
					)}
					{message && <p className="profile-message" role="status">{message}</p>}

					<div className="profile-actions" aria-label="Profile actions">
						<ProfileAction
							icon={<ShoppingBag size={21} />}
							title="My Orders"
							description="View your order history and download games"
							onClick={onOrdersClick}
						/>
						<ProfileAction
							icon={<Pencil size={21} />}
							title="Edit Profile"
							description="Update your username and email"
							onClick={handleEditProfile}
						/>
						<ProfileAction
							icon={<LockKeyhole size={21} />}
							title="Change Password"
							description="Update your password to keep your account secure"
							onClick={onChangePasswordClick}
						/>
						<ProfileAction
							icon={<LogOut size={21} />}
							title="Logout"
							description="Sign out of your Zyro account"
							onClick={onLogout}
						/>
					</div>
				</div>
			</section>
		</main>
	);
}

function ProfilePage() {
	const navigate = useNavigate();
	const storedUser = localStorage.getItem("zyroUser");
	const storedData = storedUser ? JSON.parse(storedUser) : null;
	const user = storedData?.user ?? storedData;

	return (
		<Profile
			id={user?.id}
			userRole={user?.role}
			username={user?.username}
			email={user?.email}
			memberSince={user?.createdAt ?? "May 2023"}
			onChangePasswordClick={() => navigate("/change-password")}
			onLogout={() => {
				logout();
				navigate("/login", { replace: true });
			}}
		/>
	);
}

export function logout(): void {
    localStorage.removeItem("zyroUser");
    localStorage.removeItem("isLoggedIn");
    window.dispatchEvent(new Event("auth-state-change"));
}

export default ProfilePage;

