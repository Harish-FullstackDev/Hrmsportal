import Image from "next/image";
import Link from "next/link";

import chevronDown from "@/assets/Apply/icons/chevron-down-16.svg";

// Read-only building blocks of the review stage (Figma 1403:11863). Values
// sit in boxes drawn like the stage inputs (42 tall, 8 radius, muted text),
// so the review mirrors the form the candidate filled in.

// Figma 1403:11920: 18px blue section title, 16 above a white card with a
// soft 38px shadow and 12 radius. "Edit" goes back to that stage; the
// entries are kept, so the candidate can change one thing and come back.
export function ReviewSection({ title, editHref, children, className = "" }) {
    return (
        <section className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg leading-[1.2] font-medium text-action">{title}</h2>
                {editHref && (
                    <Link href={editHref} className="text-sm leading-5 text-action underline-offset-2 hover:underline">
                        Edit<span className="sr-only"> {title}</span>
                    </Link>
                )}
            </div>
            <div
                className={`w-full rounded-xl bg-white px-4 shadow-[0px_4px_38.3px_0px_rgba(0,0,0,0.21)] sm:px-[23px] ${className}`}
            >
                {children}
            </div>
        </section>
    );
}

// Three columns (20 apart, rows 17 apart) like the stage forms.
export function ReviewGrid({ children }) {
    return <dl className="grid w-full gap-x-5 gap-y-[17px] md:grid-cols-2 lg:grid-cols-3">{children}</dl>;
}

const boxClass = "flex h-[42px] w-full min-w-0 items-center rounded-lg border border-border-default text-sm leading-5";

// One answer: label, 12 gap, value box, and the hint line under it when given
// (the review keeps the stage's hint, e.g. the Aadhaar/UAN note).
// `kind`: "select" adds the chevron, "phone" the +91 cell; `tone` "muted" is
// Figma's grey box (#f9fafb) and `valueClassName` recolours the value.
export function ReviewField({ label, required, value, hint, kind, tone, valueClassName = "text-muted-ink", className = "" }) {
    const empty = value == null || value === "" || (Array.isArray(value) && value.length === 0);
    const text = empty ? "Not provided" : Array.isArray(value) ? value.join(", ") : value;
    const bg = tone === "muted" ? "bg-[#f9fafb]" : "bg-white";

    return (
        <div className={`flex min-w-0 flex-col ${className}`}>
            <dt className="text-lg leading-[1.2] font-medium text-[#374151]">
                {label}
                {required && <span className="text-[#ef4444]">*</span>}
            </dt>
            <dd className="mt-3">
                {kind === "phone" ? (
                    <div className={`${boxClass} ${bg} gap-3 pr-[13px] pl-[5px]`}>
                        <span className="flex h-full w-[38px] shrink-0 items-center justify-center border-r-[0.5px] border-border-strong text-muted-ink">
                            +91
                        </span>
                        <span className={`truncate ${empty ? "text-hint" : valueClassName}`}>{text}</span>
                    </div>
                ) : (
                    <div className={`${boxClass} ${bg} justify-between gap-2 px-[13px]`}>
                        <span className={`truncate ${empty ? "text-hint" : valueClassName}`}>{text}</span>
                        {kind === "select" && <Image src={chevronDown} alt="" width={16} height={16} className="shrink-0" />}
                    </div>
                )}
                {hint && <p className="mt-1 text-xs leading-[1.4] font-light text-[#6b7280] italic">{hint}</p>}
            </dd>
        </div>
    );
}

// Figma 1403:12086: white card listing each ticked skill with its level as a
// small green pill (#d9ebe0 fill, #008e59 border), names and pills in a
// column at least 170 wide (longer names push it wider), rows 11 apart.
export function ReviewSkillLevels({ levels }) {
    const entries = Object.entries(levels ?? {});
    return (
        <div className="flex w-full flex-col gap-4">
            <p className="text-lg leading-[1.2] font-medium text-[#374151]">
                Skills check for this role<span className="text-[#ef4444]">*</span>
            </p>
            {entries.length === 0 ? (
                <p className="text-sm leading-5 text-hint">Not provided</p>
            ) : (
                <ul className="flex w-full max-w-[396px] flex-col gap-[11px] rounded-lg border border-[#e2e8f0] bg-white p-[13px]">
                    {entries.map(([skill, level]) => (
                        <li key={skill} className="flex w-fit min-w-[170px] items-center justify-between gap-3">
                            <span className="text-sm leading-5 font-medium whitespace-nowrap text-[#334155]">{skill}</span>
                            <span className="flex h-5 w-[75px] shrink-0 items-center justify-center rounded-full border border-[#008e59] bg-[#d9ebe0] text-[10px] leading-[1.4] text-[#00794c]">
                                {level || "—"}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
