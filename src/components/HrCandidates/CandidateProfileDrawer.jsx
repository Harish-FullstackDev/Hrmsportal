"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import chevronDownIcon from "@/assets/HrCandidates/icons/chevron-down-16-muted.svg";
import closeIcon from "@/assets/HrCandidates/icons/close-16.svg";
import HrMenu from "@/components/HrCommon/HrMenu";
import { CANDIDATE_STATUSES } from "./candidatesData";

const heading = "text-sm leading-[1.4] text-ink";
const detail = "text-xs leading-[1.4] text-ink-secondary";
const missing = <p className="text-xs leading-[1.4] text-muted-ink">Not provided yet.</p>;

// Figma 1983:8726: candidate profile, a 420 wide drawer from the right over
// a 40% black backdrop. Escape, the close button or the backdrop close it;
// focus stays inside while it's open and goes back to the row afterwards.
export default function CandidateProfileDrawer({ candidate, onClose, onStatusChange }) {
    const panelRef = useRef(null);
    const closeRef = useRef(null);

    useEffect(() => {
        const opener = document.activeElement;
        closeRef.current?.focus();
        const { overflow } = document.body.style;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = overflow;
            opener?.focus?.();
        };
    }, []);

    const onKeyDown = (event) => {
        if (event.key === "Escape" && !event.defaultPrevented) {
            onClose();
            return;
        }
        if (event.key !== "Tab") return;
        const focusable = [...panelRef.current.querySelectorAll("button, textarea, a[href]")].filter((el) => !el.disabled);
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    };

    const status = CANDIDATE_STATUSES.find((option) => option.value === candidate.status);

    return (
        <div className="fixed inset-0 z-50 flex justify-end" onKeyDown={onKeyDown}>
            <div
                aria-hidden="true"
                onClick={onClose}
                className="absolute inset-0 bg-black/40 motion-safe:animate-[hr-fade-in_200ms_ease-out]"
            />
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="candidate-profile-name"
                className="relative flex h-dvh w-[420px] max-w-full flex-col overflow-y-auto bg-surface-drawer shadow-[0_-5px_50px_-12px_rgba(0,0,0,0.42)] motion-safe:animate-[hr-drawer-in_300ms_ease-out]"
            >
                <div className="flex flex-col gap-2.5 border-b border-slate-line/80 px-5 pt-5 pb-[17px]">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <h2 id="candidate-profile-name" className="text-base leading-[1.2] font-medium text-ink">
                                {candidate.name}
                            </h2>
                            <p className="text-xs leading-[1.4] text-slate-muted">{candidate.jobTitle}</p>
                        </div>
                        <button
                            ref={closeRef}
                            type="button"
                            onClick={onClose}
                            aria-label="Close candidate details"
                            className="shrink-0 rounded border border-slate-line p-[5px] hover:bg-white"
                        >
                            <Image src={closeIcon} alt="" className="size-4" />
                        </button>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            className="flex-1 rounded-lg bg-action px-4 py-2.5 text-sm leading-[1.4] text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] hover:bg-primary"
                        >
                            Schedule Interview
                        </button>
                        <HrMenu
                            label="Candidate stage"
                            items={CANDIDATE_STATUSES.map((option) => ({
                                label: option.label,
                                selected: option.value === candidate.status,
                                onSelect: () => onStatusChange(candidate.id, option.value),
                            }))}
                            menuClassName="min-w-32"
                            className="flex h-[34px] w-32 shrink-0 items-center justify-between rounded-lg border border-[rgb(51_65_85/0.8)] bg-navy-900 px-[13px] text-sm leading-[1.4] text-white"
                        >
                            {status.label}
                            <Image src={chevronDownIcon} alt="" className="size-4" />
                        </HrMenu>
                    </div>
                    <button
                        type="button"
                        className="rounded-lg border border-border-default px-[17px] py-[9px] text-xs leading-4 text-ink hover:bg-white"
                    >
                        Download Resume
                    </button>
                </div>

                <div className="flex flex-col gap-5 p-5">
                    <section className="flex flex-col gap-[3px]">
                        <h3 className={heading}>Contact</h3>
                        <p className={detail}>{[candidate.email, candidate.phone].filter(Boolean).join(" · ")}</p>
                    </section>
                    <section className="flex flex-col gap-[3px]">
                        <h3 className={heading}>Experience &amp; Education</h3>
                        {candidate.background ? <p className={detail}>{candidate.background}</p> : missing}
                    </section>
                    <section className="flex flex-col gap-2">
                        <h3 className="text-xs leading-[1.4] text-ink">Skills</h3>
                        {candidate.skills?.length ? (
                            <ul className="flex flex-wrap gap-2">
                                {candidate.skills.map((skill) => (
                                    <li
                                        key={skill}
                                        className="rounded border border-border-default px-[11px] py-[5px] text-xs leading-[1.4] text-primary-400"
                                    >
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            missing
                        )}
                    </section>
                    <section className="flex flex-col gap-2">
                        <h3 className={heading}>Resume Preview</h3>
                        <div className="flex h-[179px] items-center justify-center rounded-lg border border-border-default text-xs leading-[1.4] text-slate-muted">
                            Resume preview placeholder
                        </div>
                    </section>
                    <section>
                        <h3 className={`${heading} border-b border-slate-line pb-[7px]`}>Timeline &amp; Application History</h3>
                        {candidate.timeline?.length ? (
                            <ul>
                                {candidate.timeline.map(({ label, at }) => (
                                    <li key={label} className="flex justify-between gap-4 pt-2 text-xs leading-[1.4] text-muted-ink">
                                        <span>{label}</span>
                                        <span>{at}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="pt-2">{missing}</div>
                        )}
                    </section>
                    <section className="flex flex-col gap-1">
                        <h3 className={heading}>Interview Feedback</h3>
                        <p className="text-xs leading-[1.4] text-muted-ink">No interviews yet.</p>
                    </section>
                    <section className="flex flex-col gap-2 pb-[21px]">
                        <h3 className={heading}>
                            <label htmlFor="candidate-notes">Internal HR Notes</label>
                        </h3>
                        <textarea
                            id="candidate-notes"
                            className="h-[70px] resize-y rounded-lg border border-border-default bg-transparent p-2 text-xs leading-[1.4] text-ink focus:border-action focus:outline-none"
                        />
                    </section>
                </div>
            </div>
        </div>
    );
}
