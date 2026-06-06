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
    payload
) => {
    return API.post(
        `/blog/v1/metadata`,
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