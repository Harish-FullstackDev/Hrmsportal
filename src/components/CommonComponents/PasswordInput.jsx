"use client";

import { useState } from "react";
import Image from "next/image";

// Password field with a show/hide toggle. `hiddenIcon` / `visibleIcon` are
// static SVG imports; each renders at its intrinsic size, in rem so it scales
// with pages that use data-figma-scale.
export default function PasswordInput({
    fieldClassName = "",
    hiddenIcon,
    visibleIcon,
    className = "",
    ...inputProps
}) {
    const [visible, setVisible] = useState(false);
    const icon = visible ? visibleIcon : hiddenIcon;

    return (
        <div className={`flex items-center bg-white focus-within:border-accent ${fieldClassName}`}>
            <input
                {...inputProps}
                type={visible ? "text" : "password"}
                className={`h-full min-w-0 flex-1 bg-transparent outline-none ${className}`}
            />
            <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                aria-label={visible ? "Hide password" : "Show password"}
                aria-pressed={visible}
                className="grid size-[2.125rem] shrink-0 place-items-center rounded-md focus-visible:outline-2 focus-visible:outline-accent"
            >
                <Image
                    src={icon}
                    alt=""
                    style={{ width: `${icon.width / 16}rem`, height: `${icon.height / 16}rem` }}
                />
            </button>
        </div>
    );
}
