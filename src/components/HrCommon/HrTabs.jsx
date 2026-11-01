"use client";

// Figma 1921:3479: filter tabs above an HR list, 34 tall on a full-width
// rule. The active tab is medium ink with a blue count badge and a 2px blue
// underline; the others are 16px secondary text, 24 apart. The row scrolls
// sideways on phones rather than wrapping.
export default function HrTabs({ tabs, value, onChange, label }) {
    return (
        <div className="overflow-x-auto border-b border-neutral-200">
            <div role="tablist" aria-label={label} className="flex h-[34px] items-start gap-6">
                {tabs.map((tab) => {
                    const active = tab.value === value;
                    return (
                        <button
                            key={tab.value}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            onClick={() => onChange(tab.value)}
                            className={`relative flex h-full shrink-0 items-start gap-2 text-base whitespace-nowrap capitalize ${
                                active ? "font-medium leading-[1.2] text-ink" : "leading-[1.5] text-ink-secondary hover:text-ink"
                            }`}
                        >
                            {tab.label}
                            {active && (
                                <span className="rounded-full bg-action px-2 py-0.5 font-sans text-xs leading-4 font-medium text-surface-drawer">
                                    {tab.count}
                                </span>
                            )}
                            {active && (
                                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-action" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
