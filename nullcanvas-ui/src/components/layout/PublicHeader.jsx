import { Link, useNavigate } from "react-router-dom";

/**
 * Header for the public, no-auth reading experience (home + shared blog pages).
 */
function PublicHeader() {

    const navigate = useNavigate();

    return (
        <nav className="nc-navbar">
            <div className="nc-navbar__inner">

                <Link to="/" className="nc-brand">
                    <span className="nc-brand__mark">N</span>
                    <span>NullCanvas</span>
                </Link>

                <div className="d-flex align-items-center gap-2">
                    <Link to="/" className="nc-navlink d-none d-sm-inline-flex">
                        Explore
                    </Link>
                    <button
                        className="nc-btn nc-btn--ghost nc-btn--sm"
                        onClick={() => navigate("/login")}
                    >
                        Sign in
                    </button>
                    <button
                        className="nc-btn nc-btn--primary nc-btn--sm"
                        onClick={() => navigate("/register")}
                    >
                        <i className="bi bi-pencil-square" />
                        <span className="d-none d-sm-inline">Start writing</span>
                    </button>
                </div>

            </div>
        </nav>
    );
}

export default PublicHeader;
