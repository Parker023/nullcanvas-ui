import { Link } from "react-router-dom";

const FEATURES = [
    { icon: "bi-pencil-square", text: "A distraction-free writing canvas" },
    { icon: "bi-images", text: "Rich media, cover images & tags" },
    { icon: "bi-globe2", text: "Publish and share with the world" }
];

function AuthLayout({ children }) {
    return (
        <div className="nc-auth">

            <aside className="nc-auth__aside">

                <Link to="/" className="nc-brand" style={{ color: "#fff" }}>
                    <span
                        className="nc-brand__mark"
                        style={{ background: "rgba(255,255,255,0.18)", boxShadow: "none" }}
                    >
                        N
                    </span>
                    <span>NullCanvas</span>
                </Link>

                <div>
                    <p className="nc-auth__quote">
                        Your ideas deserve a beautiful canvas.
                    </p>
                    <p style={{ opacity: 0.9, marginTop: "0.8rem", fontSize: "1.02rem" }}>
                        Write, publish and share your stories — all in one place.
                    </p>
                </div>

                <div>
                    {FEATURES.map(f => (
                        <div key={f.text} className="nc-auth__feature">
                            <i className={`bi ${f.icon}`} />
                            <span>{f.text}</span>
                        </div>
                    ))}
                </div>

            </aside>

            <main className="nc-auth__main">
                <div className="nc-auth__card nc-rise">
                    {children}
                </div>
            </main>

        </div>
    );
}

export default AuthLayout;
