import API from "./axiosConfig";

export const createBlogContent = async (
    blogId,
    payload
) => {

    return API.post(
        `/blog/v1/${blogId}/content`,
        payload
    );
};

export const createBlog = (
    blogPublicId,
    payload
) => {
    return API.post(
        `/blog/v1/${blogPublicId}/metadata`,
        payload
    );
};


export const uploadChunk = (
    blogId,
    payload
) => {

    return API.post(
        `/blog/v1/${blogId}/chunk`,
        payload
    );
};

export const getMyBlogs = async (page = 0, size = 10) => {
    const response = await API.get("/blog/v1/my-blogs", {
        params: { page, size }
    });

    return response.data;
};

export const getBlogContent = async (
    blogId,
    slug
) => {

    const response = await API.get(
        `/blog/v1/content/${blogId}/${slug}`
    );

    return response.data;
};
export const deleteBlog = async (blogId) => {

    const response = await API.delete(
        `/blog/v1/${blogId}`
    );

    return response.data;
};

export const updateMetadata = async (
    blogId,
    metadata
) => {

    return API.put(
        `/blog/v1/${blogId}/metadata`,
        metadata
    );
};

export const updateContent = async (
    blogId,
    content
) => {

    return API.put(
        `/blog/v1/${blogId}/content`,
        content
    );
};

export const getRecentBlogs = async () => {
    const response =
        await API.get("/blog/v1/recent");

    return response.data;
};

export const uploadImage = async (file, blogId, type) => {

    const formData = new FormData();

    formData.append(
        "file",
        file
    );

    const response =
        await API.post(
            `/v1/resources/${blogId}/upload`,
            formData,
            {
                params: {
                    type
                },
                headers: {
                    "Content-Type":
                        "multipart/form-data"
                }
            }
        );

    return response.data;
};

export const initializeBlog = async () => {
    return API.post("/blog/v1/blogshell");
};