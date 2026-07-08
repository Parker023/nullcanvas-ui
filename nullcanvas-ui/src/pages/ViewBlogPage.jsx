import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlogContent } from "../api/blogApi";
import BlogViewer from "../components/BlogViewer";
import PublicHeader from "../components/layout/PublicHeader";
import { FullscreenLoader } from "../components/ui/Loader";
import { useToast } from "../components/ui/ToastProvider";
import ExportMenu from "../components/blog/ExportMenu";

function ViewBlogPage() {

    const { blogId, slug } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [blog, setBlog] = useState(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        loadBlog();
    }, [blogId, slug]);

    useEffect(() => {
        const onScroll = () => {
            const scrollTop = window.scrollY;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(height > 0 ? Math.min(100, (scrollTop / height) * 100) : 0);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, [blog]);

    async function loadBlog() {
        try {
            const response = await getBlogContent(blogId, slug);
            setBlog(response);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load this blog.");
        }
    }

    const goBack = () => {
        // Fall back to home when opened directly from a shared link.
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate("/");
        }
    };

    const handleShare = async () => {
        const url = window.location.href;
        const shareData = {
            title: blog?.metadata?.title || "NullCanvas",
            text: blog?.metadata?.summary || "",
            url
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
                return;
            }
            await navigator.clipboard.writeText(url);
            toast.success("Link copied to clipboard.");
        } catch (error) {
            // User cancelled the native share sheet — not an error worth surfacing.
            if (error?.name === "AbortError") {
                return;
            }
            try {
                await navigator.clipboard.writeText(url);
                toast.success("Link copied to clipboard.");
            } catch {
                toast.error("Could not share this link.");
            }
        }
    };

    if (!blog) {
        return (
            <>
                <PublicHeader />
                <FullscreenLoader label="Loading article..." />
            </>
        );
    }

    return (
        <>
            <div className="nc-progress" style={{ width: `${progress}%` }} />
            <PublicHeader />

            <article className="nc-container nc-container--narrow nc-rise">

                <div className="d-flex align-items-center justify-content-between mb-4">
                    <button
                        className="nc-btn nc-btn--ghost nc-btn--sm"
                        onClick={goBack}
                    >
                        <i className="bi bi-arrow-left" /> Back
                    </button>

                    <div className="d-flex align-items-center gap-2">
                        <button
                            className="nc-btn nc-btn--soft nc-btn--sm"
                            onClick={handleShare}
                        >
                            <i className="bi bi-share" /> Share
                        </button>

                        <ExportMenu
                            title={blog.metadata.title}
                            content={blog.content}
                        />
                    </div>
                </div>

                {blog.metadata.coverImageUrl && (
                    <img
                        src={blog.metadata.coverImageUrl}
                        alt={blog.metadata.title}
                        className="w-100 mb-4"
                        style={{ maxHeight: 420, objectFit: "cover", borderRadius: "var(--nc-radius)" }}
                    />
                )}

                <h1 className="nc-heading" style={{ fontSize: "2.4rem", lineHeight: 1.15 }}>
                    {blog.metadata.title}
                </h1>

                {blog.metadata.summary && (
                    <p className="nc-muted" style={{ fontSize: "1.15rem", marginTop: "0.75rem" }}>
                        {blog.metadata.summary}
                    </p>
                )}

                <div className="d-flex flex-wrap align-items-center gap-2 my-3">
                    {blog.metadata.tags?.map(tag => (
                        <span key={tag.tagPublicId} className="nc-chip">
                            <i className="bi bi-tag" /> {tag.name}
                        </span>
                    ))}
                    <span className="nc-stat">
                        <i className="bi bi-calendar3" />
                        {new Date(blog.metadata.createdAt).toLocaleDateString(undefined, {
                            month: "long",
                            day: "numeric",
                            year: "numeric"
                        })}
                    </span>
                </div>

                <hr style={{ borderColor: "var(--nc-border)", opacity: 1 }} />

                <BlogViewer content={blog.content} />

            </article>
        </>
    );
}

export default ViewBlogPage;
