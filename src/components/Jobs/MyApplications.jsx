"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { withdrawApplication } from "@/lib/applications/actions";

// Hiring pipeline, in order (values match the application_status enum). An
// application at one of these stages is active; any other status (hired,
// rejected, withdrawn) has ended and moves it to the Closed tab.
const STAGES = [
    { value: "applied", label: "Application Received" },
    { value: "screening", label: "Screening" },
    { value: "shortlisted", label: "Shortlisted" },
    { value: "assessment", label: "Assessment" },
    { value: "interviewing", label: "Interviewing" },
    { value: "offer", label: "Offer" },
];
const STAGE_INDEX = Object.fromEntries(STAGES.map(({ value }, index) => [value, index]));
const ENDED_LABELS = { hired: "Hired", rejected: "Not Selected", withdrawn: "Withdrawn" };

const TABS = [
    { key: "active", label: "Active" },
    { key: "closed", label: "Closed" },
];

const isActive = (application) => application.status in STAGE_INDEX;

function formatDate(iso) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function PinIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
            <circle cx="12" cy="9.5" r="2.5" />
        </svg>
    );
}

function BuildingIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <rect x="3" y="4" width="18" height="17" rx="1" />
            <path d="M7 8h2M7 12h2M7 16h2M15 8h2M15 12h2M15 16h2" />
        </svg>
    );
}

function ClockIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
        </svg>
    );
}

function FileIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e5484d" strokeWidth="2" aria-hidden>
            <rect x="4" y="3" width="13" height="16" rx="1.5" />
            <path d="M8 8h5M8 12h5M20 7v12a2 2 0 0 1-2 2H8" />
        </svg>
    );
}

const chipClass = "inline-flex items-center gap-1.5 rounded-md bg-neutral-100 px-2.5 py-1 text-sm leading-[1.4] text-ink";

function ProgressPanel({ stageIndex }) {
    const previous = STAGES[stageIndex - 1];
    const next = STAGES[stageIndex + 1];

    return (
        <div className="flex flex-col gap-3 rounded-lg bg-[#eef3fb] p-4">
            <div className="flex items-center justify-between gap-4 text-sm leading-[1.4]">
                <p className="text-ink">Application Progress</p>
                <p className="text-action">
                    Stage {stageIndex + 1} of {STAGES.length}
                </p>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#dbe5f0]">
                <div
                    className="h-full rounded-full bg-action"
                    style={{ width: `${((stageIndex + 1) / STAGES.length) * 100}%` }}
                />
            </div>
            <div className="grid grid-cols-1 gap-1 text-[13px] leading-[1.4] sm:grid-cols-3">
                <p className="text-ink-secondary">{previous ? `Cleared: ${previous.label}` : ""}</p>
                <p className="text-action sm:text-center">Current: {STAGES[stageIndex].label}</p>
                <p className="text-ink-secondary sm:text-right">{next ? `Next: ${next.label}` : ""}</p>
            </div>
        </div>
    );
}

// Ref "active card.png" (collapsed) and "acive card view.png" (expanded).
// `application` comes from listMyApplications.
function ApplicationCard({ application, onWithdraw }) {
    const [expanded, setExpanded] = useState(false);
    const { job } = application;
    const stageIndex = STAGE_INDEX[application.status] ?? -1;
    const active = stageIndex !== -1;
    const position = job?.title ?? "Position no longer listed";

    const location = job?.location ? `${job.location}${job.modeOfWork ? ` (${job.modeOfWork})` : ""}` : null;
    const department = job?.department;

    return (
        <article className="flex flex-col gap-4 rounded-xl border border-[#e6e9ee] bg-white p-6 shadow-[0px_1px_3px_rgba(14,43,75,0.06)] sm:px-8">
            <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2 text-sm leading-[1.4]">
                    {active ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-[#d9efe3] px-3 py-1 text-[#00a05a]">
                            <span className="size-1.5 rounded-full bg-[#00a05a]" aria-hidden />
                            Stage {stageIndex + 1} of {STAGES.length}: {STAGES[stageIndex].label}
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-border-strong">
                            <span className="size-1.5 rounded-full bg-border-strong" aria-hidden />
                            {ENDED_LABELS[application.status] ?? application.status}
                        </span>
                    )}
                    {job?.jobCode && (
                        <span className="rounded-full bg-[#eef2f8] px-3 py-1 text-ink-secondary">Job ID: {job.jobCode}</span>
                    )}
                </div>

                <h2 className="text-2xl leading-[1.2] font-medium text-ink">
                    {job ? (
                        <Link href={`/jobs/${job.slug}`} className="transition-colors hover:text-action">
                            {position}
                        </Link>
                    ) : (
                        position
                    )}
                </h2>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm leading-[1.4] text-ink-secondary">
                    {location && (
                        <span className="flex items-center gap-1.5">
                            <PinIcon />
                            {location}
                        </span>
                    )}
                    {department && (
                        <span className="flex items-center gap-1.5">
                            <BuildingIcon />
                            {department}
                        </span>
                    )}
                    <span className="flex items-center gap-1.5">
                        <ClockIcon />
                        Applied {formatDate(application.appliedAt)}
                    </span>
                </div>
            </div>

            {expanded && (
                <div className="flex flex-col gap-6 pt-2">
                    {active && <ProgressPanel stageIndex={stageIndex} />}

                    {/* A resume is required to apply, so the row always shows. */}
                    <div className="flex flex-wrap items-center gap-2 border-t border-[#e6e9ee] pt-4 text-sm leading-[1.4] text-ink-secondary">
                        <span className="mr-1">Submitted:</span>
                        <span className={chipClass}>
                            <FileIcon />
                            {application.resumeName || "Resume"}
                        </span>
                    </div>
                </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setExpanded((value) => !value)}
                    className="inline-flex h-7 cursor-pointer items-center rounded bg-action px-2.5 text-sm leading-[1.4] text-white transition-colors hover:bg-[#005192]"
                >
                    {expanded ? "View less" : "View Details"}
                </button>
                {active && (
                    <button
                        type="button"
                        onClick={() => {
                            if (window.confirm(`Withdraw your application for ${position}?`)) onWithdraw();
                        }}
                        className="inline-flex h-7 cursor-pointer items-center rounded bg-[#eef3fb] px-2.5 text-sm leading-[1.4] text-action transition-colors hover:bg-[#dbe5f0]"
                    >
                        Withdraw
                    </button>
                )}
            </div>
        </article>
    );
}

// Ref "active.png": Active / Closed tabs on a white bar under the header,
// then one full-width card per application. `applications` come from
// listMyApplications, loaded on the server.
// `embedded` (My Profile, Figma 1867:3647): the page has its own heading and
// margins; the tabs sit on a grey rule, the open one in blue.
export default function MyApplications({ applications, embedded = false }) {
    const router = useRouter();
    const [tab, setTab] = useState("active");
    const [error, setError] = useState("");

    const visible = applications.filter((application) => isActive(application) === (tab === "active"));

    const withdraw = async (id) => {
        setError("");
        const result = await withdrawApplication(id);
        if (!result.ok) setError(result.error);
        router.refresh();
    };

    return (
        <>
            <div
                className={
                    embedded
                        ? "border-b border-border-default bg-white px-4 sm:px-8"
                        : "w-full bg-white px-4 shadow-[0px_4px_8px_rgba(0,0,0,0.06)] sm:px-16"
                }
            >
                {!embedded && <h1 className="sr-only">My Applications</h1>}
                <div role="tablist" className={`flex items-center ${embedded ? "gap-6" : "gap-8"}`}>
                    {TABS.map((item) => {
                        const selected = item.key === tab;
                        return (
                            <button
                                key={item.key}
                                type="button"
                                role="tab"
                                aria-selected={selected}
                                onClick={() => setTab(item.key)}
                                className={`cursor-pointer border-b-2 px-1 py-4 text-lg leading-[1.2] transition-colors ${
                                    embedded
                                        ? selected
                                            ? "border-action font-medium text-action"
                                            : "border-transparent font-medium text-muted-ink hover:text-ink-secondary"
                                        : selected
                                          ? "border-ink font-medium text-ink"
                                          : "border-transparent text-border-strong hover:text-ink-secondary"
                                }`}
                            >
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <section className={embedded ? "w-full pt-8" : "w-full px-4 pt-8 pb-16 sm:px-16"}>
                {error && (
                    <p role="alert" className="mb-6 rounded-lg border border-required bg-[#fdf2f2] px-4 py-3 text-sm leading-5 text-required">
                        {error}
                    </p>
                )}
                {visible.length === 0 ? (
                    <div className="flex flex-col items-start gap-4 py-6">
                        <p className="text-base leading-[1.5] text-ink-secondary">
                            {tab === "active" ? "You have no active applications." : "You have no closed applications."}
                        </p>
                        {tab === "active" && (
                            <Link
                                href="/jobs"
                                className="inline-flex h-11 items-center rounded-lg bg-action px-6 text-base leading-[1.5] text-white transition-colors hover:bg-[#005192]"
                            >
                                Search Jobs
                            </Link>
                        )}
                    </div>
                ) : (
                    <ul className="flex flex-col gap-6">
                        {visible.map((application) => (
                            <li key={application.id}>
                                <ApplicationCard application={application} onWithdraw={() => withdraw(application.id)} />
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </>
    );
}
