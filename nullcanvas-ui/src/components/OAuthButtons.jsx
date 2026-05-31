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
        <>
            <button
                className="btn btn-danger w-100 mb-2"
                onClick={loginWithGoogle}
            >
                Continue with Google
            </button>

            <button
                className="btn btn-dark w-100"
                onClick={loginWithGithub}
            >
                Continue with GitHub
            </button>
        </>
    );
}

export default OAuthButtons;