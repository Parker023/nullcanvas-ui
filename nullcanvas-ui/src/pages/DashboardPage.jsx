import { useNavigate } from "react-router-dom";
import { logout } from "../api/authApi";

function DashboardPage() {

    const navigate = useNavigate();

    const handleLogout = async () => {

        try {

            await logout();

            navigate("/login");

        } catch (error) {

            console.error(error);
        }
    };

    return (

        <div className="container mt-5">

            <div className="d-flex justify-content-between align-items-center mb-5">

                <h1>NullCanvas</h1>

                <button
                    className="btn btn-outline-danger"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

            <div className="row">

                <div className="col-md-4">

                    <div className="card shadow-sm">

                        <div className="card-body">

                            <h5 className="card-title">
                                Write a Blog
                            </h5>

                            <p className="card-text">
                                Create and publish your next article.
                            </p>

                            <button
                                className="btn btn-primary"
                                onClick={() =>
                                    navigate("/create-blog")
                                }
                            >
                                Start Writing
                            </button>

                        </div>

                    </div>

                </div>

            </div>

            <div className="col-md-4">

                <div className="card shadow-sm">

                    <div className="card-body">

                        <h5 className="card-title">
                            My Blogs
                        </h5>

                        <p className="card-text">
                            View and manage your blogs.
                        </p>

                        <button
                            className="btn btn-outline-primary"
                            disabled
                        >
                            Coming Soon
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default DashboardPage;