import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OAuthSuccessPage() {

    const navigate = useNavigate();

    useEffect(() => {
        navigate("/dashboard");
    }, []);

    return <div>Signing you in...</div>;
}