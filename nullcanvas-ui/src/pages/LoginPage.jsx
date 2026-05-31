import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/authApi";
import { isValidEmail } from "../util/validation";
import "bootstrap-icons/font/bootstrap-icons.css";
import OAuthButtons from "../components/OAuthButtons";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState("");


    const navigate = useNavigate();


    const handleLogin = async () => {
        try {
            if (!isValidEmail(email)) {
                setEmailError("Please enter a valid email address");
                return;
            }
            setEmailError("");

            const response = await login({
                email,
                password
            });

            console.log(response);

            navigate("/dashboard");

        } catch (error) {
            console.error(error);
            alert("Login Failed");
        }
    };
    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center">
            <div className="card p-4 shadow" style={{ width: "400px" }}>

                <h2 className="text-center mb-4">
                    NullCanvas Login
                </h2>

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
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
                    </button>
                </div>

                <button
                    className="btn btn-primary w-100"
                    onClick={handleLogin}
                >
                    Login
                </button>
                <hr />

                <OAuthButtons />

                <p className="mt-3 text-center">
                    Don't have an account?{" "}
                    <Link to="/register">
                        Register
                    </Link>
                </p>

            </div>
        </div>

    );


}


export default LoginPage;