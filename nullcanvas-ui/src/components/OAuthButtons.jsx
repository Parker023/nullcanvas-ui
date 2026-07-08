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
        <div className="nc-oauth">

            <button
                type="button"
                className="nc-oauth__btn"
                onClick={loginWithGoogle}
            >
                <FaGoogle size={18} />
                Google
            </button>

            <button
                type="button"
                className="nc-oauth__btn"
                onClick={loginWithGithub}
            >
                <FaGithub size={18} />
                GitHub
            </button>

        </div>
    );
}

export default OAuthButtons;
