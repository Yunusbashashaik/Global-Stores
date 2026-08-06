import { useEffect, useRef } from "react";

export default function GlassModal({ title, onClose, children, wide = false }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="glass-modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className={`glass-modal${wide ? " glass-modal--wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="glass-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="glass-modal-shine" aria-hidden="true" />
        <header className="glass-modal-header">
          <h2 id="glass-modal-title">{title}</h2>
          <button
            ref={closeRef}
            type="button"
            className="glass-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                fill="currentColor"
                d="M18.3 5.71 12 12.01l-6.3-6.3-1.4 1.41 6.29 6.3-6.3 6.29 1.42 1.42 6.29-6.3 6.3 6.3 1.41-1.42-6.3-6.29 6.3-6.3z"
              />
            </svg>
          </button>
        </header>
        <div className="glass-modal-body">{children}</div>
      </div>
    </div>
  );
}
