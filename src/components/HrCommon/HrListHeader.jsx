"use client";

import Image from "next/image";

import chevronDownIcon from "@/assets/HrCommon/icons/chevron-down-19.svg";
import plusIcon from "@/assets/HrDashboard/icons/plus-9.svg";
import HrMenu from "./HrMenu";

// Figma 1935:4081: the list title (32 medium) with a status filter and
// Create Job on the right, 8 apart. The filter picks the same statuses as the
// tabs above it, so both stay in step.
export default function HrListHeader({ title, filterLabel, options, value, onChange }) {
    const current = options.find((option) => option.value === value) ?? options[0];

    return (
        <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-[32px] leading-[1.2] font-medium text-ink-heading capitalize">{title}</h1>
            <div className="flex items-center gap-2">
                <HrMenu
                    label={filterLabel}
                    align="end"
                    items={options.map((option) => ({
                        label: option.label,
                        selected: option.value === current.value,
                        onSelect: () => onChange(option.value),
                    }))}
                    className="flex h-10 items-center gap-2 rounded border border-border-default bg-white px-[15px] text-sm leading-[1.4] whitespace-nowrap text-ink-heading hover:bg-surface-brand-subtle"
                >
                    {current.filterLabel ?? current.label}
                    <Image src={chevronDownIcon} alt="" className="size-[19px]" />
                </HrMenu>
                <button
                    type="button"
                    className="flex h-10 items-center gap-2 rounded bg-action px-4 text-sm leading-[1.4] whitespace-nowrap text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] transition-colors hover:bg-primary"
                >
                    <Image src={plusIcon} alt="" className="size-[9.333px]" />
                    Create Job
                </button>
            </div>
        </div>
    );
}
