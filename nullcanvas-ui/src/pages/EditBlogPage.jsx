import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBlogContent, updateContent, updateMetadata, uploadImage } from "../api/blogApi";
import BlogEditor from "../components/BlogEditor";
import { getAllTags, createTag } from "../api/tagService";
import CreatableSelect from "react-select/creatable";
import Navbar from "../components/layout/Navbar";
import { FullscreenLoader } from "../components/ui/Loader";
import { useToast } from "../components/ui/ToastProvider";
import ExportMenu from "../components/blog/ExportMenu";

function EditBlogPage() {

    const { blogId, slug } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState({ type: "doc", content: [] });
    const [visibility, setVisibility] = useState("PUBLIC");
    const [status, setStatus] = useState("DRAFT");
    const [coverImageUrl, setCoverImageUrl] = useState("");
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        async function init() {
            await loadTags();
            await loadBlog();
        }
        init();
    }, [blogId, slug]);

    async function loadBlog() {
        try {
            const response = await getBlogContent(blogId, slug);

            setTitle(response.metadata.title);
            setSummary(response.metadata.summary);
            setVisibility(response.metadata.visibility);
            setStatus(response.metadata.status);
            setContent(response.content);
            setCoverImageUrl(response.metadata.coverImageUrl || "");

            setSelectedTags(
                response.metadata.tags.map(tag => ({
                    value: tag.tagPublicId,
                    label: tag.name
                }))
            );
        } catch (error) {
            console.error(error);
            toast.error("Failed to load blog.");
        } finally {
            setLoading(false);
        }
    }

    const tagOptions = tags.map(tag => ({
        value: tag.tagPublicId,
        label: tag.name
    }));

    const handleCreateTag = async (inputValue) => {
        const normalizedInput = inputValue.trim().toLowerCase();

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
            console.error(error);
            toast.error("Failed to create tag");
        }
    };

    async function handleSave() {
        const tagPublicIds = selectedTags.map(tag => tag.value);

        setSaving(true);
        try {
            await updateMetadata(blogId, {
                title,
                summary,
                visibility,
                status,
                coverImageUrl,
                tagPublicIds
            });

            await updateContent(blogId, { content });

            toast.success("Blog updated successfully!");
            navigate("/my-blogs");

        } catch (error) {
            console.error("Error updating blog:", error);
            toast.error("Failed to update blog.");
        } finally {
            setSaving(false);
        }
    }

    async function handleCoverUpload(event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        setUploadingCover(true);
        try {
            const response = await uploadImage(file, blogId, "COVER_IMAGE");
            setCoverImageUrl(response.url);
            toast.success("Cover image updated.");
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload image");
        } finally {
            setUploadingCover(false);
        }
    }

    const loadTags = async () => {
        try {
            const response = await getAllTags();
            setTags(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <FullscreenLoader label="Loading your blog..." />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="nc-container nc-container--narrow">

                <div
                    className="d-flex justify-content-between align-items-center mb-4 py-2"
                    style={{ position: "sticky", top: 64, zIndex: 900 }}
                >
                    <div className="d-flex align-items-center gap-2">
                        <button
                            className="nc-btn nc-btn--ghost nc-btn--sm"
                            onClick={() => navigate(-1)}
                        >
                            <i className="bi bi-arrow-left" />
                        </button>
                        <h1 className="nc-heading mb-0" style={{ fontSize: "1.4rem" }}>
                            Edit Blog
                        </h1>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <ExportMenu title={title} content={content} />
                        <button
                            className="nc-btn nc-btn--primary"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? "Updating..." : "Update Blog"}
                            {!saving && <i className="bi bi-check-lg" />}
                        </button>
                    </div>
                </div>

                {/* Cover */}
                <label className="nc-label">Cover image</label>
                {coverImageUrl && (
                    <div className="mb-3">
                        <img
                            src={coverImageUrl}
                            alt="Cover"
                            className="w-100"
                            style={{ maxHeight: 300, objectFit: "cover", borderRadius: "var(--nc-radius)" }}
                        />
                    </div>
                )}
                <label
                    className="nc-btn nc-btn--ghost nc-btn--sm mb-4"
                    style={{ cursor: "pointer" }}
                >
                    <i className="bi bi-cloud-arrow-up" />
                    {uploadingCover ? "Uploading..." : coverImageUrl ? "Change cover" : "Upload cover"}
                    <input
                        type="file"
                        accept="image/*"
                        className="d-none"
                        onChange={handleCoverUpload}
                    />
                </label>

                {/* Title */}
                <div className="nc-field">
                    <label className="nc-label">Title</label>
                    <input
                        type="text"
                        className="nc-input"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </div>

                {/* Summary */}
                <div className="nc-field">
                    <label className="nc-label">Summary</label>
                    <textarea
                        className="nc-textarea"
                        rows="3"
                        value={summary}
                        onChange={e => setSummary(e.target.value)}
                    />
                </div>

                {/* Tags */}
                <div className="nc-field">
                    <label className="nc-label">Tags</label>
                    <CreatableSelect
                        isMulti
                        classNamePrefix="nc-rs"
                        options={tagOptions}
                        value={selectedTags}
                        onChange={(value) => setSelectedTags(value)}
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
                                    onClick={() => setVisibility(v)}
                                >
                                    {v === "PUBLIC" ? "Public" : "Private"}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="nc-label">Status</label>
                        <div className="nc-segment">
                            {[["DRAFT", "Draft"], ["PUBLISHED", "Published"]].map(([v, label]) => (
                                <button
                                    key={v}
                                    type="button"
                                    className={`nc-segment__btn ${status === v ? "nc-segment__btn--active" : ""}`}
                                    onClick={() => setStatus(v)}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <label className="nc-label">Content</label>
                <BlogEditor
                    blogId={blogId}
                    content={content}
                    onChange={setContent}
                />

            </div>
        </>
    );
}

export default EditBlogPage;
