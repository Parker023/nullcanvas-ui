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

function BlogCard({ blog, onOpen, actions }) {
    return (
        <div
            className="nc-card nc-card--interactive nc-blog-card"
            onClick={onOpen}
            role={onOpen ? "button" : undefined}
        >

            {blog.coverImageUrl ? (
                <img
                    src={blog.coverImageUrl}
                    alt={blog.title}
                    className="nc-blog-card__media"
                />
            ) : (
                <div className="nc-blog-card__media-fallback">
                    <i className="bi bi-file-earmark-richtext" />
                </div>
            )}

            <div className="nc-blog-card__body">

                {(blog.status || blog.visibility) && (
                    <div className="d-flex gap-2 mb-1 flex-wrap">
                        {blog.status && (
                            <span className={`nc-chip ${blog.status === "PUBLISHED" ? "nc-chip--success" : "nc-chip--warning"}`}>
                                <span className="nc-dot" />
                                {blog.status}
                            </span>
                        )}
                        {blog.visibility && (
                            <span className="nc-chip nc-chip--muted">
                                <i className={`bi ${blog.visibility === "PRIVATE" ? "bi-lock" : "bi-globe"}`} />
                                {blog.visibility}
                            </span>
                        )}
                    </div>
                )}

                <h3 className="nc-blog-card__title">
                    {blog.title || "Untitled"}
                </h3>

                {blog.summary && (
                    <p className="nc-blog-card__summary">
                        {blog.summary}
                    </p>
                )}

                <div className="nc-blog-card__meta">
                    <i className="bi bi-calendar3" />
                    {formatDate(blog.createdAt)}
                </div>

            </div>

            {actions && (
                <div
                    className="nc-card-actions"
                    onClick={(e) => e.stopPropagation()}
                >
                    {actions}
                </div>
            )}

        </div>
    );
}

export default BlogCard;
