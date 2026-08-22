import {
	CalendarDays,
	ChevronRight,
	LockKeyhole,
	Mail,
	Pencil,
	ShoppingBag,
	UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./profile.css";

type ProfileProps = {
	username?: string;
	email?: string;
	memberSince?: string;
	onOrdersClick?: () => void;
	onEditProfileClick?: () => void;
	onChangePasswordClick?: () => void;
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
	username = "Alex Walker",
	email = "alex.walker@email.com",
	memberSince = "May 2023",
	onOrdersClick,
	onEditProfileClick,
	onChangePasswordClick,
}: ProfileProps) {
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
							onClick={onEditProfileClick}
						/>
						<ProfileAction
							icon={<LockKeyhole size={21} />}
							title="Change Password"
							description="Update your password to keep your account secure"
							onClick={onChangePasswordClick}
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

	return <Profile
		username={user?.username}
		email={user?.email}
		memberSince={user?.createdAt ?? "May 2023"}
		onChangePasswordClick={() => navigate("/change-password")}
	/>;
}

export default ProfilePage;

