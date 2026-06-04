import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { resendOtp, verifyOtp } from "../api/authApi";
import { useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

function VerifyOtpPage() {

    const location = useLocation();

    const email = location.state?.email;

    const [otp, setOtp] = useState("");

    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(30);

    useEffect(() => {

        if (countdown <= 0) {
            return;
        }

        const timer = setTimeout(() => {
            setCountdown(countdown - 1);
        }, 1000);

        return () => clearTimeout(timer);

    }, [countdown]);

    const handleVerify = async () => {

        try {
            console.log("Verifying OTP for email:", email, "with OTP:", otp);

            await verifyOtp({
                email,
                otp
            });

            alert("Account Verified");

            navigate("/login");

        } catch (error) {

           alert(error.response?.data?.message || "Registration Failed");
        }
    };

    const handleResendOtp
        = async () => {

            try {
                console.log("Resending OTP to email:", email);

                await resendOtp({
                    email
                });

                alert("OTP Resent");
                navigate(
                    "/verify-otp",
                    {
                        state: {
                            email
                        }
                    }
                );

            } catch (error) {
                alert(error.response?.data?.message || "Registration Failed");
            }
        };

    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center">

            <div className="card p-4 shadow" style={{ width: "400px" }}>

                <h3>Verify OTP</h3>

                <p>
                    OTP sent to:
                    <br />
                    {email}
                </p>

                <input
                    className="form-control"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />
                <button
                    className="btn btn-primary mt-3 w-100"
                    onClick={handleVerify}
                >
                    Verify
                </button>


                {
                    countdown > 0
                        ? <p>Resend OTP in {countdown}s</p>
                        : (
                            <button
                                onClick={handleResendOtp}
                            >
                                Resend OTP
                            </button>
                        )
                }

            </div>
        </div>
    );
}

export default VerifyOtpPage;