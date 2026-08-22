import { useState } from "react";
import { changePassword } from "../../services/api";
import "./ChangePassword.css";

function ChangePasswordPage() {
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setForm((previousForm) => ({
            ...previousForm,
            [name]: value,
        }));
    };

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (form.newPassword !== form.confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        setIsSubmitting(true);

        try {
            await changePassword({
                currentPassword : form.currentPassword,
                newPassword : form.newPassword,
                ConfirmPassword : form.confirmPassword
            });

            setForm({
                currentPassword : "",
                newPassword : "",
                confirmPassword : ""
            });

            setSuccess("Your password has been changed successfully.");
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Unable to change your password. Please try again.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="change-password-page">
            <form className="change-password-form" onSubmit={handleSubmit}>
                <div className="change-password-heading">
                    <span className="change-password-eyebrow">ACCOUNT SECURITY</span>
                    <h1>Change Password</h1>
                    <p>Choose a strong password to keep your account secure.</p>
                </div>

                <div className="change-password-fields">
            <label htmlFor="current-password">Current password</label>
            <input
                id="current-password"
                name="currentPassword"
                type="password"
                value={form.currentPassword}
                onChange={handleChange}
                autoComplete="current-password"
                required
            />

            <label htmlFor="new-password">New password</label>
            <input
                id="new-password"
                name="newPassword"
                type="password"
                value={form.newPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
            />

            <label htmlFor="confirm-password">Confirm password</label>
            <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
            />

                </div>

                {error && <p className="change-password-message change-password-error" role="alert">{error}</p>}
                {success && <p className="change-password-message change-password-success" role="status">{success}</p>}

                <button className="change-password-submit" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Changing password..." : "Change password"}
                </button>
            </form>
        </main>
    );
}

export default ChangePasswordPage;