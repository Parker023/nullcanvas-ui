import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FullscreenLoader } from "../components/ui/Loader";

function OAuthSuccessPage() {

    const navigate = useNavigate();

    useEffect(() => {
        navigate("/dashboard");
    }, [navigate]);

    return <FullscreenLoader label="Signing you in..." />;
}

export default OAuthSuccessPage;
