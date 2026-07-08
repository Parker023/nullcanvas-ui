import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { me } from "../api/authApi";
import { FullscreenLoader } from "./ui/Loader";

function ProtectedRoute({ children }) {

    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {

        me()
            .then(() => {
                setAuthenticated(true);
            })
            .catch(() => {
                setAuthenticated(false);
            })
            .finally(() => {
                setLoading(false);
            });

    }, []);

    if (loading) {
        return <FullscreenLoader label="Checking your session..." />;
    }

    return authenticated
        ? children
        : <Navigate to="/login" replace />;
}

export { ProtectedRoute };