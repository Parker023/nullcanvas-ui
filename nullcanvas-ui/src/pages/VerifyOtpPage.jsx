import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { verifyOtp } from "../api/authApi";

function VerifyOtpPage() {

    const location = useLocation();

    const email = location.state?.email;

    const [otp, setOtp] = useState("");

    const navigate = useNavigate();


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

            alert("Invalid OTP");
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

            </div>
        </div>
    );
}

export default VerifyOtpPage;