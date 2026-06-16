import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBlogContent, updateContent, updateMetadata } from "../api/blogApi";
import BlogEditor from "../components/BlogEditor";
import { useNavigate } from "react-router-dom";

function EditBlogPage() {

    const { blogId, slug } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState(null);
    const [visibility, setVisibility] = useState("PUBLIC");
    const [status, setStatus] = useState("DRAFT");

    useEffect(() => {
        loadBlog();
    }, [blogId, slug]);

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

    async function handleSave() {

        try {

            await updateMetadata(
                blogId,
                {
                    title,
                    summary,
                    visibility,
                    status
                }
            );

            await updateContent(
                blogId,
                {
                    content
                }
            );


            alert("Blog updated successfully!");

            navigate("/my-blogs");

        } catch (error) {
            console.error("Error updating blog:", error);
            alert("Failed to update blog.");
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
            <div className="mb-4">

                <label className="form-label fw-bold">
                    Visibility
                </label>

                <select
                    className="form-select"
                    value={visibility}
                    onChange={(e) =>
                        setVisibility(e.target.value)
                    }
                >
                    <option value="PUBLIC">Public</option>
                    <option value="PRIVATE">Private</option>
                </select>

            </div>

            <div className="mb-4">

                <label className="form-label fw-bold">
                    Status
                </label>

                <select
                    className="form-select"
                    value={status}
                    onChange={(e) =>
                        setStatus(e.target.value)
                    }
                >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                </select>

            </div>


            <BlogEditor
                content={content}
                onChange={setContent}
            />

            <button
                className="btn btn-primary mt-3"
                onClick={handleSave}
            >
                Update Blog
            </button>

            {/* BlogEditor component can be used here with content and onChange props */}

        </div>
    );
}

export default EditBlogPage;