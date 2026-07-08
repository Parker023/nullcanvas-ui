import { useState, useRef, useEffect } from "react";

/**
 * Lightweight dropdown. `trigger` is the button content; `items` is an array of
 * { icon, label, onClick, disabled }. Closes on outside click and on selection.
 */
export default function Menu({ trigger, items, className = "", align = "start" }) {

    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (!open) {
            return;
        }
        const onClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        const onKey = (e) => e.key === "Escape" && setOpen(false);
        document.addEventListener("mousedown", onClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onClick);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    return (
        <div className="nc-menu" ref={ref}>
            <button
                type="button"
                className={className}
                onClick={() => setOpen(o => !o)}
                aria-haspopup="true"
                aria-expanded={open}
            >
                {trigger}
            </button>

            {open && (
                <div className={`nc-menu__panel nc-menu__panel--${align}`}>
                    {items.map((item, i) => (
                        <button
                            key={i}
                            type="button"
                            className="nc-menu__item"
                            disabled={item.disabled}
                            onClick={() => {
                                setOpen(false);
                                item.onClick?.();
                            }}
                        >
                            {item.icon && <i className={`bi ${item.icon}`} />}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
