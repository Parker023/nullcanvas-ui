import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBlogContent } from "../api/blogApi";
import BlogViewer from "../components/BlogViewer";

function ViewBlogPage() {

    const { blogId, slug } = useParams();

    const [blog, setBlog] = useState(null);

    useEffect(() => {
        loadBlog();
    }, [blogId, slug]);

    async function loadBlog() {

        const response =
            await getBlogContent(
                blogId,
                slug
            );

        setBlog(response);
    }

    if (!blog) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">

            <h1>{blog.metadata.title}</h1>

            <p className="text-muted">
                {blog.metadata.summary}
            </p>

            <div className="mb-3">
                {blog.metadata.tags?.map(tag => (
                    <span
                        key={tag.tagPublicId}
                        className="badge bg-secondary me-2"
                    >
                        {tag.name}
                    </span>
                ))}
            </div>
            <div className="mb-3">
                <small className="text-muted">
                    Published on{" "}
                    {new Date(
                        blog.metadata.createdAt
                    ).toLocaleDateString()}
                </small>
            </div>

            <hr />
            <BlogViewer
                content={blog.content}
            />

        </div>
    );
}

export default ViewBlogPage;