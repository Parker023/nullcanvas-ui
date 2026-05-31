

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import VerifyOtpPage from "../pages/VerifyOtpPage";
import OAuthSuccessPage from "../pages/OAuthSuccessPage";

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
                    element={<DashboardPage />}
                />

                <Route
                    path="/verify-otp"
                    element={<VerifyOtpPage />}
                />
                <Route
                    path="/oauth-success"
                    element={<OAuthSuccessPage />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;