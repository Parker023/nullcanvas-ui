import { createContext, useContext, useState, useCallback, useRef } from "react";

const ToastContext = createContext(null);

const ICONS = {
    success: "bi-check-circle-fill",
    error: "bi-exclamation-octagon-fill",
    info: "bi-info-circle-fill"
};

export function ToastProvider({ children }) {

    const [toasts, setToasts] = useState([]);
    const idRef = useRef(0);

    const dismiss = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const push = useCallback((message, type = "info", duration = 4000) => {

        const id = ++idRef.current;

        setToasts(prev => [...prev, { id, message, type }]);

        if (duration) {
            setTimeout(() => dismiss(id), duration);
        }

        return id;
    }, [dismiss]);

    const toast = {
        success: (m, d) => push(m, "success", d),
        error: (m, d) => push(m, "error", d),
        info: (m, d) => push(m, "info", d)
    };

    return (
        <ToastContext.Provider value={toast}>

            {children}

            <div className="nc-toast-wrap">
                {toasts.map(t => (
                    <div
                        key={t.id}
                        className={`nc-toast nc-toast--${t.type}`}
                        role="alert"
                    >
                        <i className={`nc-toast__icon bi ${ICONS[t.type]}`} />

                        <div className="nc-toast__body">
                            {t.message}
                        </div>

                        <button
                            className="nc-toast__close"
                            onClick={() => dismiss(t.id)}
                            aria-label="Dismiss"
                        >
                            <i className="bi bi-x-lg" />
                        </button>
                    </div>
                ))}
            </div>

        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);

    if (!ctx) {
        // Fallback so components never crash if used outside provider.
        return {
            success: (m) => window.alert(m),
            error: (m) => window.alert(m),
            info: (m) => window.alert(m)
        };
    }

    return ctx;
}
