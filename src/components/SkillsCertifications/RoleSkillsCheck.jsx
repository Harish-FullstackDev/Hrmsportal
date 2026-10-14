import Image from "next/image";

import checkboxChecked from "@/assets/Apply/icons/checkbox-checked-16.svg";

export const SKILL_LEVELS = ["Working", "Strong", "Expert"];

// Figma 1380:3598: grey panel listing the role's skills as checkbox cards,
// three per row (12 apart, rows 16 apart). An unticked card is a white
// 48-tall row; ticking it turns it blue and opens a "Level:" row underneath
// (Working / Strong / Expert, the chosen one green). `value` maps each ticked
// skill to its level ("" until one is chosen).
export default function RoleSkillsCheck({ id, skills, value, onChange, error }) {
    const toggle = (skill) => {
        const next = { ...value };
        if (skill in next) delete next[skill];
        else next[skill] = "";
        onChange(next);
    };
    const setLevel = (skill, level) => onChange({ ...value, [skill]: level });

    return (
        <fieldset
            id={id}
            tabIndex={-1}
            aria-describedby={error ? `${id}-message` : undefined}
            className="w-full rounded-[10px] bg-[#f1f1f1] px-3 py-[13px] outline-none"
        >
            <legend className="float-left w-full text-lg leading-[1.2] font-medium text-[#374151]">
                Skills check for this role<span className="text-[#ef4444]">*</span>
            </legend>

            <ul className="clear-left grid w-full items-start pt-3 gap-x-3 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                {skills.map((skill) => {
                    const checked = skill in value;
                    const level = value[skill];
                    const missingLevel = Boolean(error) && checked && !level;
                    return (
                        <li
                            key={skill}
                            className={`border p-[13px] transition-colors duration-300 ${
                                checked
                                    ? `min-h-[113px] rounded-xl bg-surface-brand-subtle ${missingLevel ? "border-required" : "border-[#bae6fd]"}`
                                    : "rounded-lg border-[#e2e8f0] bg-white"
                            }`}
                        >
                            <label className="flex cursor-pointer items-center gap-[10px] text-sm leading-5">
                                <input
                                    suppressHydrationWarning
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => toggle(skill)}
                                    className="peer sr-only"
                                />
                                {checked ? (
                                    <Image src={checkboxChecked} alt="" width={16} height={16} />
                                ) : (
                                    <span className="size-4 shrink-0 rounded-[2.5px] border border-[#767676] bg-white" />
                                )}
                                <span className={checked ? "text-[#0f172a]" : "font-medium text-[#334155]"}>{skill}</span>
                            </label>

                            {/* Opens smoothly when the card is ticked. */}
                            <div
                                className={`grid transition-[grid-template-rows] duration-300 ${checked ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                            >
                                <div className="overflow-hidden" inert={!checked}>
                                    <div
                                        role="radiogroup"
                                        aria-label={`${skill} level`}
                                        className="mt-[10px] flex flex-wrap items-center gap-[6px] border-t border-[#e0f2fe] pt-[11px] text-sm leading-5"
                                    >
                                        <span className="pr-1 text-ink-secondary">Level:</span>
                                        {SKILL_LEVELS.map((option) => {
                                            const selected = level === option;
                                            return (
                                                <button
                                                    key={option}
                                                    type="button"
                                                    role="radio"
                                                    aria-checked={selected}
                                                    onClick={() => setLevel(skill, option)}
                                                    className={`cursor-pointer rounded-lg border px-[10px] py-1 transition-colors ${
                                                        selected
                                                            ? "border-[#008e59] bg-[#008e59] text-white"
                                                            : "border-[#e2e8f0] bg-white text-[#475569] hover:border-[#008e59]"
                                                    }`}
                                                >
                                                    {option}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>

            {error && (
                <p id={`${id}-message`} className="mt-3 text-xs leading-[1.4] text-required">
                    {error}
                </p>
            )}
        </fieldset>
    );
}
