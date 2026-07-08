import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRecentBlogs } from "../api/blogApi";
import PublicHeader from "../components/layout/PublicHeader";
import BlogCard from "../components/blog/BlogCard";
import { BlogCardSkeleton } from "../components/ui/Loader";

function formatDate(value) {
    if (!value) return "";
    try {
        return new Date(value).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    } catch {
        return "";
    }
}

function HomePage() {

    const navigate = useNavigate();

    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        load();
    }, []);

    async function load() {
        try {
            const data = await getRecentBlogs();
            setBlogs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const openBlog = (blog) => navigate(`/blog/${blog.publicId}/${blog.slug}`);

    const filtered = useMemo(() => {
        if (!search.trim()) {
            return blogs;
        }
        const q = search.toLowerCase();
        return blogs.filter(
            b =>
                (b.title || "").toLowerCase().includes(q) ||
                (b.summary || "").toLowerCase().includes(q)
        );
    }, [blogs, search]);

    const [featured, ...rest] = filtered;

    return (
        <>
            <PublicHeader />

            <div className="nc-container">

                {/* Hero */}
                <div className="nc-rise text-center mb-5" style={{ paddingTop: "1.5rem" }}>
                    <span className="nc-chip mb-3">
                        <i className="bi bi-book" /> Stories from the community
                    </span>
                    <h1 className="nc-heading mx-auto" style={{ fontSize: "3rem", lineHeight: 1.08, maxWidth: 720 }}>
                        Read ideas worth <span className="nc-gradient-text">sharing</span>.
                    </h1>
                    <p className="nc-muted mx-auto mt-3" style={{ fontSize: "1.12rem", maxWidth: 560 }}>
                        Discover articles from writers on NullCanvas — no account needed.
                    </p>

                    <div className="nc-input-group mx-auto mt-4" style={{ maxWidth: 460 }}>
                        <input
                            className="nc-input"
                            placeholder="Search stories..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <span className="nc-input-group__btn" style={{ pointerEvents: "none" }}>
                            <i className="bi bi-search" />
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div className="row g-4">
                        {[0, 1, 2, 3, 4, 5].map(i => (
                            <div className="col-md-6 col-lg-4" key={i}>
                                <BlogCardSkeleton />
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="nc-empty">
                        <div className="nc-empty__icon">
                            <i className="bi bi-journal-text" />
                        </div>
                        <h5 className="nc-heading">
                            {blogs.length === 0 ? "No stories published yet" : "No stories match your search"}
                        </h5>
                        <p className="nc-muted mb-0">
                            {blogs.length === 0
                                ? "Check back soon — writers are just getting started."
                                : "Try a different keyword."}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Featured (first) */}
                        {featured && !search.trim() && (
                            <div
                                className="nc-card nc-card--interactive nc-featured mb-4 nc-rise"
                                role="button"
                                onClick={() => openBlog(featured)}
                            >
                                <div className="row g-0 align-items-stretch">
                                    <div className="col-md-6">
                                        {featured.coverImageUrl ? (
                                            <img
                                                src={featured.coverImageUrl}
                                                alt={featured.title}
                                                className="nc-featured__media"
                                            />
                                        ) : (
                                            <div className="nc-featured__fallback">
                                                <i className="bi bi-file-earmark-richtext" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-6">
                                        <div className="nc-featured__body">
                                            <span className="nc-chip" style={{ alignSelf: "flex-start" }}>
                                                <i className="bi bi-star-fill" /> Featured
                                            </span>
                                            <h2 className="nc-heading mt-2 mb-0" style={{ fontSize: "1.7rem", lineHeight: 1.2 }}>
                                                {featured.title}
                                            </h2>
                                            {featured.summary && (
                                                <p className="nc-muted mt-2 mb-0" style={{ fontSize: "1.02rem" }}>
                                                    {featured.summary}
                                                </p>
                                            )}
                                            <div className="nc-blog-card__meta mt-3">
                                                <i className="bi bi-calendar3" />
                                                {formatDate(featured.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Grid */}
                        <div className="row g-4 nc-stagger">
                            {(search.trim() ? filtered : rest).map(blog => (
                                <div className="col-md-6 col-lg-4" key={blog.publicId}>
                                    <BlogCard blog={blog} onOpen={() => openBlog(blog)} />
                                </div>
                            ))}
                        </div>
                    </>
                )}

            </div>
        </>
    );
}

export default HomePage;
