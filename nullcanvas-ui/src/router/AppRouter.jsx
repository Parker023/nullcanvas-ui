

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import VerifyOtpPage from "../pages/VerifyOtpPage";
import OAuthSuccessPage from "../pages/OAuthSuccessPage";
import CreateBlogPage from "../pages/CreateBlogPage";
import MyBlogsPage from "../pages/MyBlogsPage";
import ViewBlogPage from "../pages/ViewBlogPage";
import EditBlogPage from "../pages/EditBlogPage";

import {ProtectedRoute} from "../components/ProtectedRoute";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={<Navigate to="/login" />}
                />

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/register"
                    element={<RegisterPage />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/verify-otp"
                    element={<VerifyOtpPage />}
                />
                <Route
                    path="/oauth-success"
                    element={<OAuthSuccessPage />}
                />

                 <Route
                    path="/create-blog"
                    element={
                        <ProtectedRoute>
                            <CreateBlogPage />
                        </ProtectedRoute>
                    }
                />

                 <Route
                    path="/my-blogs"
                    element={
                        <ProtectedRoute>
                            <MyBlogsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/blog/:blogId/:slug"
                    element={
                        <ProtectedRoute>
                            <ViewBlogPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/edit-blog/:blogId/:slug"
                    element={
                        <ProtectedRoute>
                            <EditBlogPage />
                        </ProtectedRoute>
                    }
                />




            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;