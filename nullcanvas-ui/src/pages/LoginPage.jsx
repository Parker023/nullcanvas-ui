import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/authApi";
import { isValidEmail } from "../util/validation";
import "bootstrap-icons/font/bootstrap-icons.css";
import OAuthButtons from "../components/OAuthButtons";
import AuthLayout from "../components/auth/AuthLayout";
import { useToast } from "../components/ui/ToastProvider";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const toast = useToast();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!isValidEmail(email)) {
            setEmailError("Please enter a valid email address");
            return;
        }
        setEmailError("");
        setError("");
        setLoading(true);

        try {
            await login({
                email,
                password
            });

            toast.success("Welcome back!");
            navigate("/dashboard");

        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Something went wrong";

            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <form onSubmit={handleLogin}>

                <h2 className="nc-heading mb-1" style={{ fontSize: "1.7rem" }}>
                    Welcome back
                </h2>
                <p className="nc-muted mb-4">
                    Log in to continue to your canvas.
                </p>

                {error && (
                    <div className="nc-toast nc-toast--error mb-3" style={{ boxShadow: "none" }}>
                        <i className="nc-toast__icon bi bi-exclamation-octagon-fill" />
                        <div className="nc-toast__body">{error}</div>
                    </div>
                )}

                <div className="nc-field">
                    <label className="nc-label">Email</label>
                    <input
                        type="email"
                        className={`nc-input ${emailError ? "nc-input--invalid" : ""}`}
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                            setEmailError("");
                        }}
                    />
                    {emailError && <div className="nc-error">{emailError}</div>}
                </div>

                <div className="nc-field">
                    <label className="nc-label">Password</label>
                    <div className="nc-input-group">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="nc-input"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError("");
                            }}
                        />
                        <button
                            type="button"
                            className="nc-input-group__btn"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label="Toggle password visibility"
                        >
                            <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="nc-btn nc-btn--primary nc-btn--block"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Log in"}
                    {!loading && <i className="bi bi-arrow-right" />}
                </button>

                <div className="nc-divider">or continue with</div>

                <OAuthButtons />

                <p className="text-center nc-muted mt-4 mb-0">
                    Don't have an account?{" "}
                    <Link to="/register" style={{ color: "var(--nc-primary)", fontWeight: 600 }}>
                        Create one
                    </Link>
                </p>

            </form>
        </AuthLayout>
    );
}

export default LoginPage;
