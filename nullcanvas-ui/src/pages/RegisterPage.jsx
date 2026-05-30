import { Link } from "react-router-dom";
import { register } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


function RegisterPage() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleRegister = async () => {

        try {

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

            alert("Registration Failed");
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

                <input
                    className="form-control mb-3"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    className="form-control mb-3"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    className="btn btn-success w-100"
                    onClick={handleRegister}
                >
                    Register
                </button>

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