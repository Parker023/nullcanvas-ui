export function FullscreenLoader({ label = "Loading..." }) {
    return (
        <div className="nc-fullscreen-loader">
            <div className="nc-spinner" />
            <div className="nc-muted">{label}</div>
        </div>
    );
}

export function Spinner({ small }) {
    return <span className={`nc-spinner ${small ? "nc-spinner--sm" : ""}`} />;
}

export function BlogCardSkeleton() {
    return (
        <div className="nc-card nc-blog-card">
            <div className="nc-skeleton" style={{ aspectRatio: "16 / 9" }} />
            <div className="nc-blog-card__body">
                <div className="nc-skeleton" style={{ height: 18, width: "80%" }} />
                <div className="nc-skeleton" style={{ height: 12, width: "100%" }} />
                <div className="nc-skeleton" style={{ height: 12, width: "60%" }} />
            </div>
        </div>
    );
}
