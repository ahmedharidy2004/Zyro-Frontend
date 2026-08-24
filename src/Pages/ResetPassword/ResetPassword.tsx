import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../services/api";
import "./ResetPassword.css";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function ResetPassword() {
    const { userId, token } = useParams<{ userId: string; token: string }>();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const hasValidLink = Boolean(userId && token && UUID_PATTERN.test(userId));

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!hasValidLink || !userId || !token) {
            setError("This password reset link is invalid or incomplete.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setIsSubmitting(true);
            const message = await resetPassword(userId, token, { newPassword });
            setSuccess(message || "Password changed successfully. Please log in.");
            setNewPassword("");
            setConfirmPassword("");
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Unable to reset your password.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!hasValidLink) {
        return (
            <main className="reset-password-page">
                <section className="reset-password-card" aria-labelledby="reset-password-title">
                    <div className="reset-password-eyebrow">INVALID LINK</div>
                    <h1 id="reset-password-title">RESET PASSWORD</h1>
                    <p className="reset-password-subtitle">
                        This password reset link is invalid or incomplete.
                    </p>
                    <Link className="reset-password-link" to="/login">
                        Return to sign in
                    </Link>
                </section>
            </main>
        );
    }

    return (
        <main className="reset-password-page">
            <section className="reset-password-card" aria-labelledby="reset-password-title">
                <div className="reset-password-eyebrow">ACCOUNT RECOVERY</div>
                <h1 id="reset-password-title">RESET PASSWORD</h1>
                <p className="reset-password-subtitle">
                    Choose a new password for your Zyro account.
                </p>

                <form className="reset-password-form" onSubmit={handleSubmit}>
                    {error && <p className="reset-password-message reset-password-error">{error}</p>}
                    {success && <p className="reset-password-message reset-password-success">{success}</p>}

                    <label htmlFor="new-password">New Password</label>
                    <input
                        id="new-password"
                        type="password"
                        autoComplete="new-password"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        minLength={6}
                        required
                    />

                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input
                        id="confirm-password"
                        type="password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        minLength={6}
                        required
                    />

                    <button type="submit" disabled={isSubmitting || Boolean(success)}>
                        {isSubmitting ? "UPDATING..." : "UPDATE PASSWORD"}
                    </button>
                </form>

                {success && (
                    <button className="reset-password-link reset-password-login-button" type="button" onClick={() => navigate("/login")}>
                        Continue to sign in
                    </button>
                )}
            </section>
        </main>
    );
}

export default ResetPassword;
