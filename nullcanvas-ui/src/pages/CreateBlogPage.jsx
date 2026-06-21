import { useNavigate } from "react-router-dom";
import { createBlog, uploadImage } from "../api/blogApi";
import { createBlogContent, initializeBlog } from "../api/blogApi";
import { uploadChunk } from "../api/blogApi";
import BlogEditor from "../components/BlogEditor";
import { getAllTags, createTag } from "../api/tagService";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { useState, useCallback, useMemo, useEffect } from "react";


function CreateBlogPage() {

    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState(null);
    const [visibility, setVisibility] = useState("PUBLIC");
    const [status, setStatus] = useState("DRAFT");
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [newTagName, setNewTagName] = useState("");
    const [blogPublicId, setBlogPublicId] = useState("");


    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isDirty, setIsDirty] = useState(false);
    const [coverImage, setCoverImage] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [coverImageUrl, setCoverImageUrl] = useState("");


    const CHUNK_SIZE = 5000;

    useEffect(() => {
        
        if (!blogPublicId) {
            initializeDraft();
        }
        loadTags();
    }, []);


    async function initializeDraft() {

        try {

            const response =
                await initializeBlog();

            setBlogPublicId(
                response.data.blogPublicId
            );

           console.log("BlogEditor blogPublicId", response);


        } catch (error) {

            console.error(error);

            alert(
                "Failed to initialize blog"
            );
        } finally {

            setLoading(false);
        }
    }

    const tagOptions = tags.map(tag => ({
        value: tag.publicId,
        label: tag.name
    }));

    const plainText = useMemo(() => {

        return content
            ? extractText(content)
            : "";

    }, [content]);

    const loadTags = async () => {
        const response = await getAllTags();
        setTags(response.data);
    };


    const handleCreateTag = async (inputValue) => {
        const normalizedInput = inputValue.trim().toLowerCase();

        if (!normalizedInput) {
            return;
        }

        const existingTag = tags.find(
            tag =>
                tag.name.trim().toLowerCase() === normalizedInput
        );

        if (existingTag) {
            const alreadySelected = selectedTags.some(
                selected =>
                    selected.value === existingTag.publicId
            );

            if (!alreadySelected) {
                setSelectedTags(prev => [
                    ...prev,
                    {
                        value: createdTag.tagPublicId,
                        label: createdTag.name
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
        }
    };

    const handleContentChange = useCallback((value) => {

        setContent(value);
        setIsDirty(true);

    }, []);


    const wordCount = plainText
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .length;

    const readingTime =
        Math.max(
            1,
            Math.ceil(wordCount / 200)
        );


    const handleSave = async (e) => {

        e.preventDefault();

        setError("");

        if (!title.trim()) {
            setError("Title is required");
            return;
        }

        if (
            !content ||
            !content.content ||
            content.content.length === 0
        ) {
            setError("Content is required");
            return;
        }

        try {


            const tagPublicIds = selectedTags.map(tag => tag.value);


            const blog = await createBlog(blogPublicId, {
                title,
                summary,
                visibility,
                status,
                tags: tagPublicIds
            });


            if (coverImage) {
                const uploadResponse =
                    await uploadImage(
                        coverImage,
                        blogPublicId,
                        "COVER_IMAGE"
                    );

                setCoverImageUrl(
                    uploadResponse.url
                );
            }





            const contentJson =
                JSON.stringify(content);

            const useChunkUpload =
                contentJson.length > CHUNK_SIZE;

            if (useChunkUpload) {

                await uploadChunkedContent(
                    blogPublicId,
                    contentJson
                );

            } else {

                await createBlogContent(
                    blogPublicId,
                    {
                        content
                    }
                );

            }
            setIsDirty(false);

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

    const handleCoverImageChange = (e) => {

        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        setCoverImage(file);

        setCoverPreview(
            URL.createObjectURL(file)
        );
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

    return (
        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-lg-10 col-xl-8">


                    <div className="card-body">


                        {error && (
                            <div className="alert alert-danger">
                                {error}
                            </div>
                        )}



                        <div
                            className="d-flex justify-content-between align-items-center py-3 mb-4 bg-white"
                            style={{
                                position: "sticky",
                                top: 0,
                                zIndex: 1000
                            }}
                        >

                            <div>
                                <h5 className="text-muted mb-0">
                                    New Blog
                                </h5>
                            </div>

                            <div className="d-flex align-items-center gap-3">

                                {isDirty ? (
                                    <span className="text-warning">
                                        Unsaved Changes
                                    </span>
                                ) : (
                                    <span className="text-success">
                                        Saved
                                    </span>
                                )}

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                    onClick={handleSave}
                                >
                                    {loading ? "Saving..." : "Save Blog"}
                                </button>

                            </div>

                        </div>

                        <form onSubmit={handleSave}>

                            <div className="mb-3">

                                <div className="mb-4">

                                    <label className="form-label fw-semibold">
                                        Cover Image
                                    </label>

                                    <input
                                        type="file"
                                        className="form-control"
                                        accept="image/*"
                                        onChange={handleCoverImageChange}
                                    />

                                    {
                                        coverPreview && (
                                            <div className="mb-4">

                                                <img
                                                    src={coverPreview}
                                                    alt="Cover Preview"
                                                    className="img-fluid rounded shadow-sm"
                                                />

                                            </div>
                                        )
                                    }

                                </div>

                                <input
                                    type="text"
                                    className="form-control border-0 shadow-none fs-1 fw-bold"
                                    placeholder="Untitled Blog"
                                    value={title}
                                    onChange={(e) => {
                                        setTitle(e.target.value);
                                        setIsDirty(true);
                                    }}
                                />

                            </div>

                            <div className="mb-3">

                                <textarea
                                    rows="2"
                                    className="form-control border-0 shadow-none text-muted"
                                    placeholder="Write a short summary..."
                                    value={summary}
                                    onChange={(e) => {
                                        setSummary(e.target.value);
                                        setIsDirty(true);
                                    }}
                                />

                            </div>

                            <div className="mb-3">
                                <label className="form-label">Tags</label>
                                <CreatableSelect
                                    isMulti
                                    options={tags.map(tag => ({
                                        value: tag.tagPublicId,
                                        label: tag.name
                                    }))}
                                    value={selectedTags}
                                    onChange={(value) => {
                                        console.log(value);
                                        setSelectedTags(value);
                                    }}
                                    onCreateOption={handleCreateTag}
                                    placeholder="Select or create tags..."
                                    formatCreateLabel={(inputValue) =>
                                        `+ Create tag "${inputValue}"`
                                    }
                                />
                            </div>


                            <div className="d-flex gap-3 mb-4">

                                <div>
                                    <label className="form-label small text-muted">
                                        Visibility
                                    </label>

                                    <select
                                        className="form-select"
                                        value={visibility}
                                        onChange={(e) =>
                                            setVisibility(e.target.value)
                                        }
                                    >
                                        <option value="PUBLIC">
                                            Public
                                        </option>

                                        <option value="PRIVATE">
                                            Private
                                        </option>

                                    </select>
                                </div>

                                <div>
                                    <label className="form-label small text-muted">
                                        Status
                                    </label>

                                    <select
                                        className="form-select"
                                        value={status}
                                        onChange={(e) =>
                                            setStatus(e.target.value)
                                        }
                                    >
                                        <option value="DRAFT">
                                            Draft
                                        </option>

                                        <option value="PUBLISHED">
                                            Publish
                                        </option>

                                    </select>
                                </div>

                            </div>

                            <div className="mb-3">

                                <label className="form-label">
                                    Content
                                </label>

                                <BlogEditor
                                    blogPublicId={blogPublicId}
                                    content={content}
                                    onChange={setContent}
                                />

                                <div className="d-flex justify-content-between mt-2 text-muted small">

                                    <span>
                                        {wordCount} words
                                    </span>

                                    <span>
                                        {readingTime} min read
                                    </span>

                                </div>

                            </div>



                        </form>

                    </div>



                </div>


            </div>

        </div>
    );
}

export default CreateBlogPage;