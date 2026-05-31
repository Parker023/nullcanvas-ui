
import { logout } from "../api/authApi";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            alert("Logout Failed");
        }
    };
    return (
        <>
            <div className="container mt-5">

                <h1>
                    Welcome to NullCanvas
                </h1>

                <p>
                    User successfully logged in.
                </p>

            </div>

            <div className="d-flex justify-content-between align-items-center">


                <button
                    className="btn btn-outline-danger"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div></>
    );
}

export default DashboardPage;