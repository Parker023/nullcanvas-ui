import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBlogContent } from "../api/blogApi";
import BlogViewer from "../components/BlogViewer";

function ViewBlogPage() {

    const { blogId, slug } = useParams();

    const [blog, setBlog] = useState(null);

    useEffect(() => {
        loadBlog();
    }, []);

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

            <h1>
                {blog.metadata.title}
            </h1>

            <p className="text-muted">
                {blog.metadata.summary}
            </p>

            <hr />

            <BlogViewer
                content={
                    blog.content.content
                }
            />

        </div>
    );
}

export default ViewBlogPage;