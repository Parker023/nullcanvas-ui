import { Link } from "react-router-dom";
import { register } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import OAuthButtons from "../components/OAuthButtons";
import AuthLayout from "../components/auth/AuthLayout";
import { isValidEmail, isValidPassword } from "../util/validation";
import { useToast } from "../components/ui/ToastProvider";

function RegisterPage() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!isValidEmail(email)) {
            setEmailError("Please enter a valid email address");
            return;
        }
        setEmailError("");

        if (!isValidPassword(password)) {
            setPasswordError("Min 8 chars with upper, lower, number & symbol");
            return;
        }
        setPasswordError("");
        setLoading(true);

        try {
            await register({
                name,
                email,
                password
            });

            toast.success("Account created — check your inbox for a code.");

            navigate(
                "/verify-otp",
                {
                    state: {
                        email
                    }
                }
            );

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <form onSubmit={handleRegister}>

                <h2 className="nc-heading mb-1" style={{ fontSize: "1.7rem" }}>
                    Create your account
                </h2>
                <p className="nc-muted mb-4">
                    Start writing on NullCanvas in seconds.
                </p>

                <div className="nc-field">
                    <label className="nc-label">Name</label>
                    <input
                        className="nc-input"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="nc-field">
                    <label className="nc-label">Email</label>
                    <input
                        type="email"
                        className={`nc-input ${emailError ? "nc-input--invalid" : ""}`}
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
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
                            className={`nc-input ${passwordError ? "nc-input--invalid" : ""}`}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setPasswordError("");
                            }}
                            placeholder="Create a strong password"
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
                    {passwordError && <div className="nc-error">{passwordError}</div>}
                </div>

                <button
                    type="submit"
                    className="nc-btn nc-btn--primary nc-btn--block"
                    disabled={loading}
                >
                    {loading ? "Creating account..." : "Create account"}
                    {!loading && <i className="bi bi-arrow-right" />}
                </button>

                <div className="nc-divider">or sign up with</div>

                <OAuthButtons />

                <p className="text-center nc-muted mt-4 mb-0">
                    Already have an account?{" "}
                    <Link to="/login" style={{ color: "var(--nc-primary)", fontWeight: 600 }}>
                        Log in
                    </Link>
                </p>

            </form>
        </AuthLayout>
    );
}

export default RegisterPage;
