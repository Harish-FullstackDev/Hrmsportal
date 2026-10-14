import Image from "next/image";

import chevronDown from "@/assets/Apply/icons/chevron-down-16.svg";

// Form building blocks of the apply stages (Figma 1380:3211 onwards).
// A field is an 18px label, 12 gap, a 42-tall input, then a 21-tall slot
// (4 + one 12px line) for the hint or the error. The slot is always there, so
// every field is 97 tall and the rows line up as in Figma.
//
// The hint/error line has the id `${id}-message`; pass it to the control as
// `describedBy` (see `messageIdFor`) so screen readers read it.
//
// Inputs carry suppressHydrationWarning for the same reason as the auth
// controls: autofill extensions add attributes before React hydrates.

const boxClass = "h-[42px] w-full rounded-lg border bg-white text-sm leading-5 transition-colors outline-none";
const borderClass = (invalid) => (invalid ? "border-required" : "border-border-default");

export const messageIdFor = (id, { hint, error } = {}) => (hint || error ? `${id}-message` : undefined);

export function ApplyField({ id, label, required = false, hint, error, className = "", children }) {
    const messageId = `${id}-message`;
    return (
        <div className={`flex min-w-0 flex-col ${className}`}>
            <label htmlFor={id} className="text-lg leading-[1.2] font-medium text-[#374151]">
                {label}
                {required && <span className="text-[#ef4444]">*</span>}
            </label>
            <div className="mt-3">{children}</div>
            <p
                id={messageId}
                className={`mt-1 min-h-[17px] text-xs leading-[1.4] ${error ? "text-required" : "font-light text-[#6b7280] italic"}`}
            >
                {error || hint}
            </p>
        </div>
    );
}

export function ApplyTextInput({ invalid, describedBy, ...props }) {
    return (
        <input
            suppressHydrationWarning
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            className={`${boxClass} ${borderClass(invalid)} px-[13px] text-ink placeholder:text-muted-ink focus:border-action`}
            {...props}
        />
    );
}

// Native select drawn like the inputs, with Figma's chevron 13 from the right.
// The empty first option is the placeholder and shows in the muted colour.
export function ApplySelect({ invalid, describedBy, placeholder, options, value, ...props }) {
    return (
        <div className="relative">
            <select
                suppressHydrationWarning
                aria-invalid={invalid || undefined}
                aria-describedby={describedBy}
                value={value}
                className={`${boxClass} ${borderClass(invalid)} cursor-pointer appearance-none pr-10 pl-[13px] focus:border-action disabled:cursor-not-allowed disabled:bg-neutral-100 ${
                    value ? "text-ink" : "text-muted-ink"
                }`}
                {...props}
            >
                <option value="" disabled>
                    {placeholder}
                </option>
                {options.map((option) => (
                    <option key={option} value={option} className="text-ink">
                        {option}
                    </option>
                ))}
            </select>
            <Image
                src={chevronDown}
                alt=""
                width={16}
                height={16}
                className="pointer-events-none absolute top-1/2 right-[13px] -translate-y-1/2"
            />
        </div>
    );
}

// Figma 1380:3248: country code in a 38-wide cell with a hairline divider,
// then the number 12 to its right.
export function ApplyPhoneInput({ invalid, describedBy, countryCode = "+91", ...props }) {
    return (
        <div
            className={`${boxClass} ${borderClass(invalid)} flex items-center gap-3 overflow-hidden pr-[13px] pl-[5px] focus-within:border-action`}
        >
            <span className="flex h-full w-[38px] shrink-0 items-center justify-center border-r-[0.5px] border-border-strong text-muted-ink">
                {countryCode}
            </span>
            <input
                suppressHydrationWarning
                type="tel"
                inputMode="tel"
                aria-invalid={invalid || undefined}
                aria-describedby={describedBy}
                className="h-full min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-muted-ink"
                {...props}
            />
        </div>
    );
}
