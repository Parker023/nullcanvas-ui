import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBlog } from "../api/blogApi";
import { createBlogContent } from "../api/blogApi";
import { uploadChunk } from "../api/blogApi";


function CreateBlogPage() {

    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [visibility, setVisibility] = useState("PUBLIC");
    const [status, setStatus] = useState("DRAFT");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const CHUNK_SIZE = 5000;


    const handleSave = async (e) => {

        e.preventDefault();

        setError("");

        if (!title.trim()) {
            setError("Title is required");
            return;
        }

        if (!content.trim()) {
            setError("Content is required");
            return;
        }

        try {

            setLoading(true);

            const blog = await createBlog({
                title,
                summary,
                visibility,
                status
            });

            const blogId =
                blog.data.blogPublicId;

            const useChunkUpload =
                content.length > CHUNK_SIZE;

            if (useChunkUpload) {

                await uploadChunkedContent(
                    blogId,
                    content
                );

            } else {

                await createBlogContent(
                    blogId,
                    {
                        content: {
                            content: content
                        }
                    }
                );

            }

            navigate("/dashboard");

        } catch (err) {

            console.error(err);

            setError(
                err?.response?.data?.message ||
                "Failed to create blog"
            );

        } finally {

            setLoading(false);

        }
    };

    function splitIntoChunks(content) {

        const chunks = [];

        for (
            let i = 0;
            i < content.length;
            i += CHUNK_SIZE
        ) {

            chunks.push(
                content.slice(
                    i,
                    i + CHUNK_SIZE
                )
            );

        }

        return chunks;
    }

    async function uploadChunkedContent(
        blogId,
        content
    ) {

        const chunks =
            splitIntoChunks(content);



        for (
            let i = 0;
            i < chunks.length;
            i++
        ) {
            console.log(
                `Uploading chunk ${i + 1}/${chunks.length}`
            );

            await uploadChunk(
                blogId,
                {
                    chunkSeq: i + 1,
                    chunk: chunks[i],
                    isFinalChunk:
                        i === chunks.length - 1
                }
            );

        }

    }

    return (
        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-8">

                    <div className="card shadow">

                        <div className="card-body">

                            <h2 className="mb-4">
                                Create Blog
                            </h2>

                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSave}>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Title
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                    />

                                </div>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Summary
                                    </label>

                                    <textarea
                                        rows="3"
                                        className="form-control"
                                        value={summary}
                                        onChange={(e) =>
                                            setSummary(e.target.value)
                                        }
                                    />

                                </div>
                                <div className="mb-4">

                                    <label className="form-label fw-bold">
                                        Visibility
                                    </label>

                                    <div className="btn-group w-100">

                                        <button
                                            type="button"
                                            className={
                                                visibility === "PUBLIC"
                                                    ? "btn btn-primary"
                                                    : "btn btn-outline-primary"
                                            }
                                            onClick={() => setVisibility("PUBLIC")}
                                        >
                                            Public
                                        </button>

                                        <button
                                            type="button"
                                            className={
                                                visibility === "PRIVATE"
                                                    ? "btn btn-primary"
                                                    : "btn btn-outline-primary"
                                            }
                                            onClick={() => setVisibility("PRIVATE")}
                                        >
                                            Private
                                        </button>

                                    </div>

                                </div>

                                <div className="mb-4">

                                    <label className="form-label fw-bold">
                                        Status
                                    </label>

                                    <div className="btn-group w-100">

                                        <button
                                            type="button"
                                            className={
                                                status === "DRAFT"
                                                    ? "btn btn-primary"
                                                    : "btn btn-outline-primary"
                                            }
                                            onClick={() => setStatus("DRAFT")}
                                        >
                                            Draft
                                        </button>

                                        <button
                                            type="button"
                                            className={
                                                status === "PUBLISHED"
                                                    ? "btn btn-primary"
                                                    : "btn btn-outline-primary"
                                            }
                                            onClick={() => setStatus("PUBLISHED")}
                                        >
                                            Publish
                                        </button>

                                    </div>

                                </div>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Content
                                    </label>

                                    <textarea
                                        rows="15"
                                        className="form-control"
                                        value={content}
                                        onChange={(e) =>
                                            setContent(e.target.value)
                                        }
                                    />

                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {
                                        loading
                                            ? "Saving..."
                                            : "Save Blog"
                                    }
                                </button>

                            </form>

                        </div>

                    </div>

                </div>


            </div>

        </div>
    );
}

export default CreateBlogPage;