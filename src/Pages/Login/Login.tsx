import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { forgetPassword, logInUser } from "../../services/api";

interface FormState {
  email: string;
  password: string;
}

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetMessage, setResetMessage] = useState("");
    const [resetError, setResetError] = useState("");
    const [isResetSubmitting, setIsResetSubmitting] = useState(false);
    const [form, setForm] = useState<FormState>({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setForm((prevForm) => ({
            ...prevForm,
            [name as keyof FormState]: value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setError("");
        setSuccess("");
        setIsSubmitting(true);

        try {
            const loggedInUser = await logInUser({
                Email: form.email,
                password: form.password,
            });

            localStorage.setItem(
                "zyroUser",
                JSON.stringify({ ...loggedInUser.user, token: loggedInUser.token }),
            );
            localStorage.setItem("isLoggedIn", "true");
            window.dispatchEvent(new Event("auth-state-change"));

            setForm({
                email: "",
                password: "",
            });
            setSuccess("Login success! Welcome back.");
            navigate("/");
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Unable to login. Please try again.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleForgotPassword = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setResetMessage("");
        setResetError("");
        setIsResetSubmitting(true);

        try {
            const message = await forgetPassword({ email: resetEmail });
            setResetMessage(message || "If an account exists, reset instructions will be sent.");
        } catch (requestError) {
            setResetError(
                requestError instanceof Error
                    ? requestError.message
                    : "Unable to request a password reset.",
            );
        } finally {
            setIsResetSubmitting(false);
        }
    };

    const showLoginForm = () => {
        setIsForgotPassword(false);
        setResetEmail("");
        setResetMessage("");
        setResetError("");
    };

    return (
        <main className="login-page">
            <section className="login-card" aria-labelledby="login-title">
                {isForgotPassword ? (
                    <>
                        <div className="login-eyebrow">ACCOUNT RECOVERY</div>
                        <h1 id="login-title" className="login-title">RESET PASSWORD</h1>
                        <p className="login-subtitle">
                            Enter your email and we&apos;ll help you get back into your account.
                        </p>

                        <form className="login-form" onSubmit={handleForgotPassword}>
                            {resetError && <p className="login-message login-error">{resetError}</p>}
                            {resetMessage && <p className="login-message login-success">{resetMessage}</p>}

                            <div className="login-field">
                                <label htmlFor="reset-email">Email Address</label>
                                <div className="login-input-wrapper">
                                    <span className="login-input-icon" aria-hidden="true"><MailIcon /></span>
                                    <input
                                        id="reset-email"
                                        type="email"
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        value={resetEmail}
                                        onChange={(event) => setResetEmail(event.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button className="login-button" type="submit" disabled={isResetSubmitting}>
                                {isResetSubmitting ? "SENDING..." : "SEND RESET LINK"}
                                <ArrowIcon />
                            </button>
                        </form>

                        <button className="login-back-link" type="button" onClick={showLoginForm}>
                            Back to sign in
                        </button>
                    </>
                ) : (
                    <>
                        <div className="login-eyebrow">WELCOME BACK</div>
                        <h1 id="login-title" className="login-title">SIGN IN</h1>
                        <p className="login-subtitle">Access your Zyro game library.</p>

                        <form className="login-form" onSubmit={handleSubmit} noValidate>
                            {error && <p className="login-message login-error">{error}</p>}
                            {success && <p className="login-message login-success">{success}</p>}

                    <div className="login-field">
                        <label htmlFor="login-email">Email Address</label>
                        <div className="login-input-wrapper">
                            <span className="login-input-icon" aria-hidden="true">
                                <MailIcon />
                            </span>
                            <input
                                id="login-email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                autoComplete="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="login-field">
                        <div className="login-label-row">
                            <label htmlFor="login-password">Password</label>
                            <button className="login-forgot-link" type="button" onClick={() => setIsForgotPassword(true)}>
                                Forgot password?
                            </button>
                        </div>
                        <div className="login-input-wrapper">
                            <span className="login-input-icon" aria-hidden="true">
                                <LockIcon />
                            </span>
                            <input
                                id="login-password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <label className="login-checkbox-label">
                        <input type="checkbox" name="rememberMe" />
                        <span>Remember me</span>
                    </label>

                    <button className="login-button" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "SIGNING IN..." : "SIGN IN"}
                        <ArrowIcon />
                    </button>
                        </form>

                        <p className="login-signup-prompt">
                            New to Zyro? <a href="/signup">Create an account</a>
                        </p>
                    </>
                )}
            </section>
        </main>
    );
};

export default Login;

const MailIcon: React.FC = () => (
	<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
		<path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
	</svg>
);

const LockIcon: React.FC = () => (
	<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
		<path d="M18 8h-1V6c0-2.8-2.2-5-5-5S7 3.2 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.7 1.3-3 3-3s3 1.3 3 3v2H9V6zm3 9c-1.1 0-2-1.3 0-1.3s2 1.3 2 2-.9 2-2 2-2-.9-2-2 .9-2 2-2z" />
	</svg>
);

const ArrowIcon: React.FC = () => (
	<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
		<path d="M5 12h14" />
		<path d="m13 6 6 6-6 6" />
	</svg>
);

