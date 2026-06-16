export const DashboardCard = ({
    title,
    description,
    buttonText,
    icon,
    onClick
}) => {
    return (
        <div className="card shadow-sm h-100">
            <div className="card-body">
                <h5 className="card-title">
                    {icon} {title}
                </h5>

                <p className="card-text">
                    {description}
                </p>

                <button
                    className="btn btn-primary"
                    onClick={onClick}
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
};
