import API from "./axiosConfig";

export const getAllTags = async () => {
    return API.get("/v1/tags/all");
};

export const createTag = async (name) => {

   

    return API.post("/v1/tags",
        { name });
};