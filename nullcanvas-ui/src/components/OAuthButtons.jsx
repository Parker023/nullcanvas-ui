import { FaGoogle, FaGithub } from "react-icons/fa";
const API_URL = import.meta.env.VITE_API_URL;

function OAuthButtons() {

    const loginWithGoogle = () => {
        window.location.href =
            `${API_URL}/oauth2/authorization/google`;
    };

    const loginWithGithub = () => {
        window.location.href =
            `${API_URL}/oauth2/authorization/github`;
    };

    return (
        <div className="d-flex justify-content-center gap-4">

            <button
                className="btn btn-light border"
                onClick={loginWithGoogle}
            >
                <FaGoogle size={24} />
            </button>

            <button
                className="btn btn-light border"
                onClick={loginWithGithub}
            >
                <FaGithub size={24} />
            </button>

        </div>
    );
}

export default OAuthButtons;