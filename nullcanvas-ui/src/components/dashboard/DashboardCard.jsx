export const DashboardCard = ({
    title,
    description,
    buttonText,
    icon,
    onClick
}) => {
    return (
        <div
            className="nc-card nc-card--interactive h-100"
            onClick={onClick}
            role="button"
        >
            <div className="p-4 d-flex flex-column h-100">

                <div
                    className="nc-empty__icon mb-3"
                    style={{ margin: 0, width: 56, height: 56, borderRadius: 16 }}
                >
                    <span style={{ fontSize: "1.6rem" }}>{icon}</span>
                </div>

                <h5 className="nc-heading mb-1">
                    {title}
                </h5>

                <p className="nc-muted mb-4" style={{ fontSize: "0.92rem" }}>
                    {description}
                </p>

                <span className="nc-btn nc-btn--soft nc-btn--sm mt-auto align-self-start">
                    {buttonText}
                    <i className="bi bi-arrow-right" />
                </span>

            </div>
        </div>
    );
};
