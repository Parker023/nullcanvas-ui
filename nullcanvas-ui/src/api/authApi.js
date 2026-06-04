

import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

export const login = (request) => {
    return API.post(
        "/auth/v1/login",
        request
    );
};

export const register = (request) => {
    return API.post(
        "/auth/v1/register",
        request
    );
};

export const verifyOtp = (request) => {
    return API.post(
        "/auth/otp/v1/verify-otp",
        request
    );
};

export const logout = () => {
    return API.post("/auth/v1/logout");
};

export const me = () => {
    return API.get("/auth/v1/me");
};

export const resendOtp = (request) => {
    return API.post(
        "/auth/otp/v1/resend-otp",
        request
    );
};