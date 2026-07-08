import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyBlogs, deleteBlog } from "../api/blogApi";
import Navbar from "../components/layout/Navbar";
import BlogCard from "../components/blog/BlogCard";
import { BlogCardSkeleton } from "../components/ui/Loader";
import { useToast } from "../components/ui/ToastProvider";

const FILTERS = ["ALL", "PUBLISHED", "DRAFT"];

// Normalize a Spring "Page" response across serialization formats:
//  - legacy flat:  { content, number, totalPages, first, last }
//  - Boot 3.3+:    { content, page: { number, totalPages, size, totalElements } }
//  - plain array:  [ ... ]
function normalizePage(response) {
    if (Array.isArray(response)) {
        return { content: response, number: 0, totalPages: 1, first: true, last: true };
    }

    const meta = response?.page ?? response ?? {};
    const number = meta.number ?? 0;
    const totalPages = meta.totalPages ?? 1;

    return {
        content: response?.content ?? [],
        number,
        totalPages,
        first: response?.first ?? meta.first ?? number <= 0,
        last: response?.last ?? meta.last ?? number >= totalPages - 1
    };
}

function MyBlogsPage() {

    const navigate = useNavigate();
    const toast = useToast();

    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageInfo, setPageInfo] = useState(null);
    const [selectedBlogId, setSelectedBlogId] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("ALL");

    useEffect(() => {
        loadBlogs();
    }, []);

    const loadBlogs = async (pageNumber = 0) => {
        setLoading(true);
        try {
            const response = await getMyBlogs(pageNumber);
            const page = normalizePage(response);

            setBlogs(page.content);
            setPageInfo({
                currentPage: page.number,
                totalPages: page.totalPages,
                first: page.first,
                last: page.last
            });
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
            console.error(error);
            toast.error("Failed to load your blogs.");
        } finally {
            setLoading(false);
        }
    };

    const visibleBlogs = useMemo(() => {
        return blogs.filter(blog => {
            const matchesFilter = filter === "ALL" || blog.status === filter;
            const matchesSearch =
                !search.trim() ||
                (blog.title || "").toLowerCase().includes(search.toLowerCase()) ||
                (blog.summary || "").toLowerCase().includes(search.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [blogs, filter, search]);

    async function confirmDelete() {
        setDeleting(true);
        try {
            await deleteBlog(selectedBlogId);

            setBlogs(prev => prev.filter(blog => blog.publicId !== selectedBlogId));
            setSelectedBlogId(null);
            toast.success("Blog deleted.");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete blog.");
        } finally {
            setDeleting(false);
        }
    }

    return (
        <>
            <Navbar />

            <div className="nc-container">

                <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between mb-4">
                    <div>
                        <h1 className="nc-heading mb-1" style={{ fontSize: "2rem" }}>
                            My Blogs
                        </h1>
                        <p className="nc-muted mb-0">Manage everything you've written.</p>
                    </div>
                    <button
                        className="nc-btn nc-btn--primary"
                        onClick={() => navigate("/create-blog")}
                    >
                        <i className="bi bi-plus-lg" /> New Blog
                    </button>
                </div>

                {/* Controls */}
                <div className="nc-panel p-3 mb-4 d-flex flex-wrap gap-3 align-items-center justify-content-between">
                    <div className="nc-input-group" style={{ maxWidth: 340, flex: "1 1 260px" }}>
                        <input
                            className="nc-input"
                            placeholder="Search your blogs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <span className="nc-input-group__btn" style={{ pointerEvents: "none" }}>
                            <i className="bi bi-search" />
                        </span>
                    </div>

                    <div className="nc-segment">
                        {FILTERS.map(f => (
                            <button
                                key={f}
                                className={`nc-segment__btn ${filter === f ? "nc-segment__btn--active" : ""}`}
                                onClick={() => setFilter(f)}
                            >
                                {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="row g-4">
                        {[0, 1, 2].map(i => (
                            <div className="col-md-6 col-lg-4" key={i}>
                                <BlogCardSkeleton />
                            </div>
                        ))}
                    </div>
                ) : visibleBlogs.length === 0 ? (
                    <div className="nc-empty">
                        <div className="nc-empty__icon">
                            <i className="bi bi-journals" />
                        </div>
                        <h5 className="nc-heading">
                            {blogs.length === 0 ? "No blogs yet" : "Nothing matches your filters"}
                        </h5>
                        <p className="nc-muted mb-3">
                            {blogs.length === 0
                                ? "Your published and draft posts will appear here."
                                : "Try a different search or filter."}
                        </p>
                        {blogs.length === 0 && (
                            <button
                                className="nc-btn nc-btn--primary"
                                onClick={() => navigate("/create-blog")}
                            >
                                <i className="bi bi-pencil-square" /> Create Blog
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="row g-4 nc-stagger">
                        {visibleBlogs.map(blog => (
                            <div className="col-md-6 col-lg-4" key={blog.publicId}>
                                <BlogCard
                                    blog={blog}
                                    onOpen={() => navigate(`/blog/${blog.publicId}/${blog.slug}`)}
                                    actions={
                                        <>
                                            <button
                                                className="nc-btn nc-btn--soft nc-btn--sm"
                                                onClick={() => navigate(`/blog/${blog.publicId}/${blog.slug}`)}
                                            >
                                                <i className="bi bi-eye" /> View
                                            </button>
                                            <button
                                                className="nc-btn nc-btn--ghost nc-btn--sm"
                                                onClick={() => navigate(`/edit-blog/${blog.publicId}/${blog.slug}`)}
                                            >
                                                <i className="bi bi-pencil" /> Edit
                                            </button>
                                            <button
                                                className="nc-btn nc-btn--danger nc-btn--sm ms-auto"
                                                onClick={() => setSelectedBlogId(blog.publicId)}
                                                aria-label="Delete blog"
                                            >
                                                <i className="bi bi-trash" />
                                            </button>
                                        </>
                                    }
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination — hidden while a client-side search/filter is active,
                    since those only narrow the current page. */}
                {pageInfo && pageInfo.totalPages > 1 && filter === "ALL" && !search.trim() && (
                    <div className="d-flex justify-content-center align-items-center gap-3 mt-5">
                        <button
                            className="nc-btn nc-btn--ghost nc-btn--sm"
                            disabled={pageInfo.first}
                            onClick={() => loadBlogs(pageInfo.currentPage - 1)}
                        >
                            <i className="bi bi-chevron-left" /> Previous
                        </button>
                        <span className="nc-stat">
                            {pageInfo.currentPage + 1} / {pageInfo.totalPages}
                        </span>
                        <button
                            className="nc-btn nc-btn--ghost nc-btn--sm"
                            disabled={pageInfo.last}
                            onClick={() => loadBlogs(pageInfo.currentPage + 1)}
                        >
                            Next <i className="bi bi-chevron-right" />
                        </button>
                    </div>
                )}

            </div>

            {/* Delete confirmation modal */}
            {selectedBlogId && (
                <div
                    className="nc-modal-backdrop"
                    onClick={() => !deleting && setSelectedBlogId(null)}
                >
                    <div className="nc-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="nc-modal__icon">
                            <i className="bi bi-exclamation-triangle" />
                        </div>
                        <h5 className="nc-heading">Delete this blog?</h5>
                        <p className="nc-muted">
                            This action can't be undone. The blog and its content will be
                            permanently removed.
                        </p>
                        <div className="d-flex gap-2 justify-content-end mt-4">
                            <button
                                className="nc-btn nc-btn--ghost"
                                onClick={() => setSelectedBlogId(null)}
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                className="nc-btn nc-btn--danger"
                                onClick={confirmDelete}
                                disabled={deleting}
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default MyBlogsPage;
