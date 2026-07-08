import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../api/authApi";
import { useToast } from "../ui/ToastProvider";

function Navbar() {

    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error(error);
            toast.error("Could not log out. Please try again.");
        }
    };

    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <nav className="nc-navbar">
            <div className="nc-navbar__inner">

                <Link to="/" className="nc-brand">
                    <span className="nc-brand__mark">N</span>
                    <span>NullCanvas</span>
                </Link>

                <div className="d-flex align-items-center gap-1 gap-md-2">

                    <Link
                        to="/dashboard"
                        className={`nc-navlink d-none d-sm-inline-flex ${isActive("/dashboard") ? "nc-navlink--active" : ""}`}
                    >
                        Dashboard
                    </Link>

                    <Link
                        to="/my-blogs"
                        className={`nc-navlink d-none d-sm-inline-flex ${isActive("/my-blogs") ? "nc-navlink--active" : ""}`}
                    >
                        My Blogs
                    </Link>

                    <Link
                        to="/"
                        className="nc-navlink d-none d-md-inline-flex"
                        title="View the public site"
                    >
                        <i className="bi bi-globe" />
                    </Link>

                    <button
                        className="nc-btn nc-btn--soft nc-btn--sm"
                        onClick={() => navigate("/create-blog")}
                    >
                        <i className="bi bi-pencil-square" />
                        <span className="d-none d-sm-inline">Write</span>
                    </button>

                    <button
                        className="nc-btn nc-btn--ghost nc-btn--sm"
                        onClick={handleLogout}
                        title="Log out"
                    >
                        <i className="bi bi-box-arrow-right" />
                        <span className="d-none d-md-inline">Logout</span>
                    </button>

                </div>

            </div>
        </nav>
    );
}

export default Navbar;
