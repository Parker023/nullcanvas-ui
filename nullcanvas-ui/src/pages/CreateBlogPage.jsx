import { useNavigate } from "react-router-dom";
import { createBlog, uploadImage } from "../api/blogApi";
import { createBlogContent, initializeBlog } from "../api/blogApi";
import { uploadChunk } from "../api/blogApi";
import BlogEditor from "../components/BlogEditor";
import { getAllTags, createTag } from "../api/tagService";
import CreatableSelect from "react-select/creatable";
import { useState, useMemo, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import { useToast } from "../components/ui/ToastProvider";

const CHUNK_SIZE = 5000;

function CreateBlogPage() {

    const navigate = useNavigate();
    const toast = useToast();

    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState(null);
    const [visibility, setVisibility] = useState("PUBLIC");
    const [status, setStatus] = useState("DRAFT");
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [blogPublicId, setBlogPublicId] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [isDirty, setIsDirty] = useState(false);
    const [coverImage, setCoverImage] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);

    useEffect(() => {
        if (!blogPublicId) {
            initializeDraft();
        }
        loadTags();
    }, []);

    async function initializeDraft() {
        try {
            const response = await initializeBlog();
            setBlogPublicId(response.data.blogPublicId);
        } catch (error) {
            console.error(error);
            toast.error("Failed to initialize blog");
        } finally {
            setLoading(false);
        }
    }

    const plainText = useMemo(() => {
        return content ? extractText(content) : "";
    }, [content]);

    const loadTags = async () => {
        try {
            const response = await getAllTags();
            setTags(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateTag = async (inputValue) => {
        const normalizedInput = inputValue.trim().toLowerCase();

        if (!normalizedInput) {
            return;
        }

        const existingTag = tags.find(
            tag => tag.name.trim().toLowerCase() === normalizedInput
        );

        if (existingTag) {
            const alreadySelected = selectedTags.some(
                selected => selected.value === existingTag.tagPublicId
            );

            if (!alreadySelected) {
                setSelectedTags(prev => [
                    ...prev,
                    {
                        value: existingTag.tagPublicId,
                        label: existingTag.name
                    }
                ]);
            }

            return;
        }

        try {
            const response = await createTag(inputValue);
            const createdTag = response.data;

            setTags(prev => [...prev, createdTag]);
            setSelectedTags(prev => [
                ...prev,
                {
                    value: createdTag.tagPublicId,
                    label: createdTag.name
                }
            ]);
        } catch (error) {
            console.error("Failed to create tag", error);
            toast.error("Failed to create tag");
        }
    };

    const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const handleSave = async (e) => {
        e.preventDefault();
        setError("");

        if (!title.trim()) {
            setError("Title is required");
            toast.error("Title is required");
            return;
        }

        if (!content || !content.content || content.content.length === 0) {
            setError("Content is required");
            toast.error("Content is required");
            return;
        }

        setSaving(true);

        try {
            const tagPublicIds = selectedTags.map(tag => tag.value);

            await createBlog(blogPublicId, {
                title,
                summary,
                visibility,
                status,
                tags: tagPublicIds
            });

            if (coverImage) {
                await uploadImage(coverImage, blogPublicId, "COVER_IMAGE");
            }

            const contentJson = JSON.stringify(content);
            const useChunkUpload = contentJson.length > CHUNK_SIZE;

            if (useChunkUpload) {
                await uploadChunkedContent(blogPublicId, contentJson);
            } else {
                await createBlogContent(blogPublicId, { content });
            }

            setIsDirty(false);
            toast.success("Blog saved!");
            navigate("/dashboard");

        } catch (err) {
            console.error(err);
            const message = err?.response?.data?.message || "Failed to create blog";
            setError(message);
            toast.error(message);
        } finally {
            setSaving(false);
        }
    };

    const handleCoverImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }
        setCoverImage(file);
        setCoverPreview(URL.createObjectURL(file));
        setIsDirty(true);
    };

    function splitIntoChunks(content) {
        const chunks = [];
        for (let i = 0; i < content.length; i += CHUNK_SIZE) {
            chunks.push(content.slice(i, i + CHUNK_SIZE));
        }
        return chunks;
    }

    async function uploadChunkedContent(blogId, content) {
        const chunks = splitIntoChunks(content);

        for (let i = 0; i < chunks.length; i++) {
            await uploadChunk(blogId, {
                chunkSeq: i + 1,
                chunk: chunks[i],
                isFinalChunk: i === chunks.length - 1
            });
        }
    }

    function extractText(node) {
        if (!node) {
            return "";
        }
        if (node.type === "text") {
            return node.text || "";
        }
        let text = "";
        if (node.content) {
            node.content.forEach(child => {
                text += extractText(child) + " ";
            });
        }
        return text;
    }

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="nc-fullscreen-loader">
                    <div className="nc-spinner" />
                    <div className="nc-muted">Preparing your canvas...</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="nc-container nc-container--narrow">

                {/* Sticky action bar */}
                <div
                    className="d-flex justify-content-between align-items-center mb-4 py-2"
                    style={{
                        position: "sticky",
                        top: 64,
                        zIndex: 900
                    }}
                >
                    <div className="d-flex align-items-center gap-2">
                        <button
                            type="button"
                            className="nc-btn nc-btn--ghost nc-btn--sm"
                            onClick={() => navigate(-1)}
                        >
                            <i className="bi bi-arrow-left" />
                        </button>
                        <span className={`nc-chip ${isDirty ? "nc-chip--warning" : "nc-chip--success"}`}>
                            <span className="nc-dot" />
                            {isDirty ? "Unsaved changes" : "Ready"}
                        </span>
                    </div>

                    <button
                        type="submit"
                        className="nc-btn nc-btn--primary"
                        disabled={saving}
                        onClick={handleSave}
                    >
                        {saving ? "Saving..." : "Save Blog"}
                        {!saving && <i className="bi bi-check-lg" />}
                    </button>
                </div>

                {error && (
                    <div className="nc-toast nc-toast--error mb-3" style={{ boxShadow: "none" }}>
                        <i className="nc-toast__icon bi bi-exclamation-octagon-fill" />
                        <div className="nc-toast__body">{error}</div>
                    </div>
                )}

                <form onSubmit={handleSave}>

                    {/* Cover image */}
                    <label className="nc-label">Cover image</label>
                    {coverPreview ? (
                        <div className="position-relative mb-3">
                            <img
                                src={coverPreview}
                                alt="Cover preview"
                                className="w-100 rounded"
                                style={{ maxHeight: 320, objectFit: "cover", borderRadius: "var(--nc-radius)" }}
                            />
                            <button
                                type="button"
                                className="nc-btn nc-btn--ghost nc-btn--sm position-absolute"
                                style={{ top: 12, right: 12, background: "var(--nc-surface)" }}
                                onClick={() => { setCoverImage(null); setCoverPreview(null); }}
                            >
                                <i className="bi bi-trash" /> Remove
                            </button>
                        </div>
                    ) : (
                        <label
                            className="nc-empty d-block mb-3"
                            style={{ cursor: "pointer", padding: "2rem" }}
                        >
                            <div className="nc-empty__icon" style={{ width: 52, height: 52 }}>
                                <i className="bi bi-cloud-arrow-up" />
                            </div>
                            <div className="nc-muted">Click to upload a cover image</div>
                            <input
                                type="file"
                                accept="image/*"
                                className="d-none"
                                onChange={handleCoverImageChange}
                            />
                        </label>
                    )}

                    {/* Title */}
                    <input
                        type="text"
                        className="nc-input mb-3"
                        style={{ fontSize: "1.8rem", fontWeight: 700, border: "none", background: "transparent", padding: "0.5rem 0" }}
                        placeholder="Untitled Blog"
                        value={title}
                        onChange={(e) => { setTitle(e.target.value); setIsDirty(true); }}
                    />

                    {/* Summary */}
                    <textarea
                        rows="2"
                        className="nc-textarea mb-4"
                        style={{ border: "none", background: "transparent", padding: "0 0 0.5rem", color: "var(--nc-text-muted)" }}
                        placeholder="Write a short summary..."
                        value={summary}
                        onChange={(e) => { setSummary(e.target.value); setIsDirty(true); }}
                    />

                    {/* Tags */}
                    <div className="nc-field">
                        <label className="nc-label">Tags</label>
                        <CreatableSelect
                            isMulti
                            classNamePrefix="nc-rs"
                            options={tags.map(tag => ({
                                value: tag.tagPublicId,
                                label: tag.name
                            }))}
                            value={selectedTags}
                            onChange={(value) => { setSelectedTags(value); setIsDirty(true); }}
                            onCreateOption={handleCreateTag}
                            placeholder="Select or create tags..."
                            formatCreateLabel={(inputValue) => `+ Create tag "${inputValue}"`}
                        />
                    </div>

                    {/* Visibility + status */}
                    <div className="d-flex flex-wrap gap-4 mb-4">
                        <div>
                            <label className="nc-label">Visibility</label>
                            <div className="nc-segment">
                                {["PUBLIC", "PRIVATE"].map(v => (
                                    <button
                                        key={v}
                                        type="button"
                                        className={`nc-segment__btn ${visibility === v ? "nc-segment__btn--active" : ""}`}
                                        onClick={() => { setVisibility(v); setIsDirty(true); }}
                                    >
                                        {v === "PUBLIC" ? "Public" : "Private"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="nc-label">Status</label>
                            <div className="nc-segment">
                                {[["DRAFT", "Draft"], ["PUBLISHED", "Publish"]].map(([v, label]) => (
                                    <button
                                        key={v}
                                        type="button"
                                        className={`nc-segment__btn ${status === v ? "nc-segment__btn--active" : ""}`}
                                        onClick={() => { setStatus(v); setIsDirty(true); }}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Content editor */}
                    <label className="nc-label">Content</label>
                    <BlogEditor
                        blogPublicId={blogPublicId}
                        content={content}
                        onChange={(value) => { setContent(value); setIsDirty(true); }}
                    />

                    <div className="d-flex justify-content-between mt-2 nc-muted" style={{ fontSize: "0.82rem" }}>
                        <span>{wordCount} words</span>
                        <span>{readingTime} min read</span>
                    </div>

                </form>

            </div>
        </>
    );
}

export default CreateBlogPage;
