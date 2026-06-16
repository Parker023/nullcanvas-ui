import { useNavigate } from "react-router-dom";
import { logout } from "../api/authApi";
import { DashboardCard } from "../components/dashboard/DashboardCard";

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
            <p className="text-muted">
                Write, publish and manage your blogs.
            </p>

            <div className="row">

                <DashboardCard
                    icon="✍️"
                    title="Create Blog"
                    description="Start writing a new article."
                    buttonText="New Blog"
                    onClick={() => navigate("/create-blog")}
                />

                <DashboardCard
                    icon="📝"
                    title="My Blogs"
                    description="View and manage your published articles."
                    buttonText="View Blogs"
                    onClick={() => navigate("/my-blogs")}
                />

            </div>



        </div>

    );
}

export default DashboardPage;