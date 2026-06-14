import { useEffect, useState } from "react";
import { getMyBlogs } from "../api/blogApi";
import { useNavigate } from "react-router-dom";
import { deleteBlog } from "../api/blogApi";

function MyBlogsPage() {

    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageInfo, setPageInfo] = useState(null);
    const [selectedBlogId, setSelectedBlogId] = useState(null);


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

    function handleDeleteClick(blogId) {

        setSelectedBlogId(blogId);
    }

    async function confirmDelete() {

        try {

            await deleteBlog(
                selectedBlogId
            );

            setBlogs(
                prev =>
                    prev.filter(
                        blog =>
                            blog.publicId !==
                            selectedBlogId
                    )
            );

            setSelectedBlogId(null);

        } catch (error) {

            console.error(error);
        }
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
                    <button
                        className="btn btn-outline-primary"
                        onClick={() =>
                            navigate(`/blog/${blog.publicId}/${blog.slug}`)
                        }
                    >
                        View
                    </button>
                    <button
                        className="btn btn-outline-danger"
                        onClick={() =>
                            handleDeleteClick(blog.publicId)
                        }
                    >
                        Delete
                    </button>

                    <button
                        className="btn btn-outline-secondary"
                        onClick={() =>
                            navigate(
                                `/edit-blog/${blog.publicId}/${blog.slug}`
                            )
                        }
                    >
                        Edit
                    </button>
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


            {
                selectedBlogId && (

                    <div
                        className="modal d-block"
                        tabIndex="-1"
                    >

                        <div className="modal-dialog">

                            <div className="modal-content">

                                <div className="modal-header">

                                    <h5 className="modal-title">
                                        Delete Blog
                                    </h5>

                                </div>

                                <div className="modal-body">

                                    <p>
                                        Are you sure you want to delete this blog?
                                    </p>

                                </div>

                                <div className="modal-footer">

                                    <button
                                        className="btn btn-secondary"
                                        onClick={() =>
                                            setSelectedBlogId(null)
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        className="btn btn-danger"
                                        onClick={confirmDelete}
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                )
            }
        </div>
    );
}

export default MyBlogsPage;