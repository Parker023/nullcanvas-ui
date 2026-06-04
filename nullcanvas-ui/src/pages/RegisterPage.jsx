import { Link } from "react-router-dom";
import { register } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import OAuthButtons from "../components/OAuthButtons";
import { isValidEmail, isValidPassword } from "../util/validation";


function RegisterPage() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () => {

        console.log("Registering user:", { name, email });

        try {

            if (!isValidEmail(email)) {
                setEmailError("Please enter a valid email address");
                console.error("Invalid email:", email);
                return;
            }
            setEmailError("");

            if (!isValidPassword(password)) {
                setPasswordError("Please enter a valid password");
                return;
            }
            setPasswordError("");


            await register({
                name,
                email,
                password
            });

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

            alert(error.response?.data?.message || "Registration Failed");
        }
    };

    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center">

            <div className="card p-4 shadow" style={{ width: "450px" }}>

                <h2 className="text-center mb-4">
                    Create Account
                </h2>


                <input
                    className="form-control mb-3"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <div className="mb-3">

                    <input
                        type="email"
                        className={`form-control ${emailError ? "is-invalid" : ""
                            }`}
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {emailError && (
                        <div className="invalid-feedback">
                            {emailError}
                        </div>
                    )}

                </div>

                <div className="input-group mb-3">
                    <input
                        type={showPassword ? "Text" : "password"}
                        className={`form-control ${passwordError ? "is-invalid" : ""
                            }`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />

                    <span
                        className="input-group-text"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
                    </span>

                    {passwordError && (
                        <div className="invalid-feedback">
                            {passwordError}
                        </div>
                    )}
                </div>

                <button
                    className="btn btn-success w-100"
                    onClick={handleRegister}
                >
                    Register
                </button>
                <hr />

                <OAuthButtons />

                <p className="text-center mt-3">
                    Already have an account?{" "}
                    <Link to="/login">
                        Login
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default RegisterPage;