import { useNavigate } from "react-router-dom";
import { logout } from "../api/authApi";
import { DashboardCard } from "../components/dashboard/DashboardCard";
import { useEffect, useState } from "react";
import { getRecentBlogs } from "../api/blogApi";

function DashboardPage() {

    const [recentBlogs, setRecentBlogs] = useState([]);
    const [loadingBlogs, setLoadingBlogs] = useState(true);

    const navigate = useNavigate();


    useEffect(() => {
        loadRecentBlogs();
    }, []);

    async function loadRecentBlogs() {

        try {

            const blogs =
                await getRecentBlogs();

            setRecentBlogs(blogs);

        } catch (error) {

            console.error(error);

        } finally {

            setLoadingBlogs(false);

        }
    }

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

                <h1 className="display-5 fw-bold">
                    NullCanvas
                </h1>

                <p className="lead text-muted">
                    Write, publish and share your ideas with the world.
                </p>
                <button
                    className="btn btn-outline-danger"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>


            <div className="row g-4">

                <div className="col-md-6">

                    <DashboardCard
                        icon="✍️"
                        title="Create Blog"
                        description="Start writing a new article."
                        buttonText="New Blog"
                        onClick={() => navigate("/create-blog")}
                    />
                </div>
                <div className="col-md-6">

                    <DashboardCard
                        icon="📝"
                        title="My Blogs"
                        description="View and manage your published articles."
                        buttonText="View Blogs"
                        onClick={() => navigate("/my-blogs")}
                    />

                </div>


            </div>

            <div className="mt-5">

                <h3 className="mb-3">
                    Recent Articles
                </h3>

                {loadingBlogs ? (

                    <div>Loading...</div>

                ) : recentBlogs.length === 0 ? (

                    <div className="alert alert-light">
                        No published blogs yet.
                    </div>

                ) : (

                    recentBlogs.map(blog => (

                        <div
                            key={blog.publicId}
                            className="card shadow-sm mb-3"
                            role="button"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                                navigate(`/blog/${blog.publicId}/${blog.slug}`)
                            }
                        >

                            {
                                blog.coverImageUrl && (

                                    <img
                                        src={blog.coverImageUrl}
                                        alt={blog.title}
                                        className="card-img-top"
                                        style={{
                                            height: "220px",
                                            objectFit: "cover"
                                        }}
                                    />

                                )
                            }

                            <div className="card-body">

                                <h5>{blog.title}</h5>

                                <p className="text-muted">
                                    {blog.summary}
                                </p>

                                <small>
                                    {new Date(
                                        blog.createdAt
                                    ).toLocaleDateString()}
                                </small>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>

    );
}

export default DashboardPage;