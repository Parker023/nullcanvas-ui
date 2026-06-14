import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBlogContent } from "../api/blogApi";


function EditBlogPage() {

    const { blogId, slug } = useParams();

    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState(null);
    const [visibility, setVisibility] = useState("PUBLIC");
    const [status, setStatus] = useState("DRAFT");

    useEffect(() => {
        loadBlog();
    }, []);

    async function loadBlog() {

        try {

            const response =
                await getBlogContent(
                    blogId,
                    slug
                );

            setTitle(response.metadata.title);
            setSummary(response.metadata.summary);
            setVisibility(response.metadata.visibility);
            setStatus(response.metadata.status);
            setContent(response.content.content);

        } finally {

            setLoading(false);
        } 
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">

            <h1>Edit Blog</h1>

            <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Summary</label>
                <textarea
                    className="form-control"
                    rows="3"
                    value={summary}
                    onChange={e => setSummary(e.target.value)}
                ></textarea>
            </div>

            {/* BlogEditor component can be used here with content and onChange props */}

        </div>
    );
}

export default EditBlogPage;