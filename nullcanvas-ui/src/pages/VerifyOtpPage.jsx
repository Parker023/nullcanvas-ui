import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resendOtp, verifyOtp } from "../api/authApi";
import "bootstrap-icons/font/bootstrap-icons.css";
import AuthLayout from "../components/auth/AuthLayout";
import { useToast } from "../components/ui/ToastProvider";

const OTP_LENGTH = 6;

function VerifyOtpPage() {

    const location = useLocation();
    const email = location.state?.email;

    const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(30);
    const inputsRef = useRef([]);

    const navigate = useNavigate();
    const toast = useToast();

    const otp = digits.join("");

    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    const focusInput = (i) => inputsRef.current[i]?.focus();

    const handleChange = (i, value) => {
        const char = value.replace(/\D/g, "").slice(-1);
        setDigits(prev => {
            const next = [...prev];
            next[i] = char;
            return next;
        });
        if (char && i < OTP_LENGTH - 1) {
            focusInput(i + 1);
        }
    };

    const handleKeyDown = (i, e) => {
        if (e.key === "Backspace" && !digits[i] && i > 0) {
            focusInput(i - 1);
        }
    };

    const handlePaste = (e) => {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (!pasted) return;
        e.preventDefault();
        const next = Array(OTP_LENGTH).fill("");
        pasted.split("").forEach((c, idx) => (next[idx] = c));
        setDigits(next);
        focusInput(Math.min(pasted.length, OTP_LENGTH - 1));
    };

    const handleVerify = async (e) => {
        e?.preventDefault();

        if (otp.length !== OTP_LENGTH) {
            toast.error("Please enter the full code");
            return;
        }

        setLoading(true);
        try {
            await verifyOtp({ email, otp });
            toast.success("Account verified — you can log in now.");
            navigate("/login");
        } catch (error) {
            toast.error(error.response?.data?.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        try {
            await resendOtp({ email });
            toast.success("A new code is on its way.");
            setCountdown(30);
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not resend code");
        }
    };

    return (
        <AuthLayout>
            <form onSubmit={handleVerify}>

                <div className="nc-empty__icon" style={{ margin: "0 0 1rem" }}>
                    <i className="bi bi-shield-lock" />
                </div>

                <h2 className="nc-heading mb-1" style={{ fontSize: "1.7rem" }}>
                    Verify your email
                </h2>
                <p className="nc-muted mb-4">
                    We sent a 6-digit code to<br />
                    <strong style={{ color: "var(--nc-text)" }}>{email || "your email"}</strong>
                </p>

                <div className="d-flex justify-content-between gap-2 mb-4" onPaste={handlePaste}>
                    {digits.map((d, i) => (
                        <input
                            key={i}
                            ref={(el) => (inputsRef.current[i] = el)}
                            className="nc-input text-center fw-bold"
                            style={{ fontSize: "1.5rem", padding: "0.6rem 0", aspectRatio: "1" }}
                            inputMode="numeric"
                            maxLength={1}
                            value={d}
                            onChange={(e) => handleChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                        />
                    ))}
                </div>

                <button
                    type="submit"
                    className="nc-btn nc-btn--primary nc-btn--block"
                    disabled={loading}
                >
                    {loading ? "Verifying..." : "Verify"}
                </button>

                <p className="text-center nc-muted mt-4 mb-0">
                    {countdown > 0 ? (
                        <>Resend code in {countdown}s</>
                    ) : (
                        <button
                            type="button"
                            className="nc-btn nc-btn--ghost nc-btn--sm"
                            onClick={handleResendOtp}
                        >
                            <i className="bi bi-arrow-clockwise" /> Resend code
                        </button>
                    )}
                </p>

            </form>
        </AuthLayout>
    );
}

export default VerifyOtpPage;
