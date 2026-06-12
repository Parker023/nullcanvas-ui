import { useEffect, useState } from "react";
import { getMyBlogs } from "../api/blogApi";

function MyBlogsPage() {

    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageInfo, setPageInfo] = useState(null);


    useEffect(() => {
        loadBlogs();
    }, []);

    const loadBlogs = async () => {
        try {
            const response = await getMyBlogs();
            setBlogs(response.content);
            setPageInfo({
                currentPage: response.number,
                totalPages: response.totalPages,
                first: response.first,
                last: response.last
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>

            <button
                className="btn btn-primary mb-3"
                onClick={() => window.history.back()}
            >
                back
            </button>
            <h1>My Blogs</h1>

            {blogs.map(blog => (
                <div
                    key={blog.publicId}
                    className="card mb-3 shadow-sm"
                >
                    <div className="card-body">
                        <h5>{blog.title}</h5>

                        <p>{blog.summary}</p>

                        <div className="mb-2">
                            <span className="badge bg-secondary me-2">
                                {blog.status}
                            </span>

                            <span className="badge bg-info">
                                {blog.visibility}
                            </span>
                        </div>

                        <small className="text-muted">
                            {new Date(blog.createdAt).toLocaleDateString()}
                        </small>
                    </div>
                </div>
            ))}

            <button
                disabled={page === 0}
                onClick={() => loadBlogs(page - 1)}
            >
                Previous
            </button>

            <span>
                {page + 1} / {totalPages}
            </span>

            <button
                disabled={page + 1 >= totalPages}
                onClick={() => loadBlogs(page + 1)}
            >
                Next
            </button>
        </div>
    );
}

export default MyBlogsPage;