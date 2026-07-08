import { useNavigate } from "react-router-dom";
import { DashboardCard } from "../components/dashboard/DashboardCard";
import { useEffect, useState } from "react";
import { getRecentBlogs } from "../api/blogApi";
import Navbar from "../components/layout/Navbar";
import BlogCard from "../components/blog/BlogCard";
import { BlogCardSkeleton } from "../components/ui/Loader";

function DashboardPage() {

    const [recentBlogs, setRecentBlogs] = useState([]);
    const [loadingBlogs, setLoadingBlogs] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        loadRecentBlogs();
    }, []);

    async function loadRecentBlogs() {
        try {
            const blogs = await getRecentBlogs();
            setRecentBlogs(blogs);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingBlogs(false);
        }
    }

    return (
        <>
            <Navbar />

            <div className="nc-container">

                {/* Hero */}
                <div className="nc-rise mb-5">
                    <span className="nc-chip mb-3">
                        <i className="bi bi-stars" /> Your creative space
                    </span>
                    <h1 className="nc-heading" style={{ fontSize: "2.6rem", lineHeight: 1.1 }}>
                        Write, publish and share
                        <br />
                        your ideas with the <span className="nc-gradient-text">world</span>.
                    </h1>
                    <p className="nc-muted mt-3" style={{ fontSize: "1.1rem", maxWidth: 560 }}>
                        A calm, focused place for your stories. Start a new post or pick up
                        where you left off.
                    </p>
                </div>

                {/* Action cards */}
                <div className="row g-4 nc-stagger mb-5">
                    <div className="col-md-6">
                        <DashboardCard
                            icon="✍️"
                            title="Create Blog"
                            description="Start writing a new article on a fresh canvas."
                            buttonText="New Blog"
                            onClick={() => navigate("/create-blog")}
                        />
                    </div>
                    <div className="col-md-6">
                        <DashboardCard
                            icon="📚"
                            title="My Blogs"
                            description="View, edit and manage everything you've published."
                            buttonText="View Blogs"
                            onClick={() => navigate("/my-blogs")}
                        />
                    </div>
                </div>

                {/* Recent articles */}
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <h3 className="nc-heading mb-0" style={{ fontSize: "1.4rem" }}>
                        Recent Articles
                    </h3>
                </div>

                {loadingBlogs ? (
                    <div className="row g-4">
                        {[0, 1, 2].map(i => (
                            <div className="col-md-6 col-lg-4" key={i}>
                                <BlogCardSkeleton />
                            </div>
                        ))}
                    </div>
                ) : recentBlogs.length === 0 ? (
                    <div className="nc-empty">
                        <div className="nc-empty__icon">
                            <i className="bi bi-journal-text" />
                        </div>
                        <h5 className="nc-heading">No published blogs yet</h5>
                        <p className="nc-muted mb-3">Be the first to share something.</p>
                        <button
                            className="nc-btn nc-btn--primary"
                            onClick={() => navigate("/create-blog")}
                        >
                            <i className="bi bi-pencil-square" /> Write your first post
                        </button>
                    </div>
                ) : (
                    <div className="row g-4 nc-stagger">
                        {recentBlogs.map(blog => (
                            <div className="col-md-6 col-lg-4" key={blog.publicId}>
                                <BlogCard
                                    blog={blog}
                                    onOpen={() => navigate(`/blog/${blog.publicId}/${blog.slug}`)}
                                />
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </>
    );
}

export default DashboardPage;
