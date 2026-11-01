// Figma 1953:4084 and its siblings: status pills of the HR lists. Each tone
// is a fill, a 1px border and a text colour.
const TONES = {
    success: "border-success-100 bg-accent-subtle text-success-500",
    brand: "border-primary-300 bg-surface-brand-subtle text-action",
    warning: "border-warning-200 bg-warning-100 text-warning-500",
    neutral: "border-border-default bg-neutral-100 text-ink",
    danger: "border-error-200 bg-error-100 text-required",
};

export default function HrStatusPill({ tone, children }) {
    return (
        <span
            className={`inline-flex items-center rounded-full border px-[11px] py-[3px] text-sm leading-[1.4] whitespace-nowrap ${TONES[tone]}`}
        >
            {children}
        </span>
    );
}
