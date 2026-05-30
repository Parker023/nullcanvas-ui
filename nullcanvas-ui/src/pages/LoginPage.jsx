import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/authApi";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();


    const handleLogin = async () => {
        try {
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
                    <label>Email</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    className="btn btn-primary w-100"
                    onClick={handleLogin}
                >
                    Login
                </button>

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