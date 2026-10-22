"use client";

import { useState } from "react";
import Link from "next/link";

import { applicationKey, useApplications, withdrawApplication } from "./candidateStorage";

// Hiring pipeline, in order. An application's status is the stage it is at;
// any status outside this list ends the application and moves it to Inactive.
const STAGES = ["Application Received", "Recruiter Screen", "Technical Portfolio Review", "Executive Panel", "Offer"];

const TABS = [
    { key: "active", label: "Active" },
    { key: "inactive", label: "Inactive" },
];

const isActive = (application) => STAGES.includes(application.status);

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

function LinkIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0061af" strokeWidth="2" aria-hidden>
            <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
            <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
        </svg>
    );
}

function VideoIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" aria-hidden>
            <rect x="3" y="6" width="13" height="12" rx="1.5" />
            <path d="m16 10 5-3v10l-5-3" />
        </svg>
    );
}

const chipClass = "inline-flex items-center gap-1.5 rounded-md bg-neutral-100 px-2.5 py-1 text-sm leading-[1.4] text-ink";

// Shown only when the application carries a scheduled interview
// ({ title, when, link }), which the recruiter side will supply.
function InterviewPanel({ interview }) {
    return (
        <div className="flex flex-col gap-4 rounded-xl border border-[#d6e3f3] bg-[#eef3fb] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3.5">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-action">
                    <VideoIcon />
                </span>
                <div className="flex flex-col gap-0.5">
                    <p className="text-xs leading-[1.4] text-action">Meeting Link Ready</p>
                    <p className="text-lg leading-[1.2] font-medium text-ink">Upcoming Interview: {interview.title}</p>
                    <p className="text-sm leading-[1.4] text-ink-secondary">{interview.when}</p>
                </div>
            </div>
            {interview.link && (
                <a
                    href={interview.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 items-center self-start rounded-md bg-action px-4 text-sm font-medium text-white transition-colors hover:bg-[#005192] sm:self-auto"
                >
                    Join Meeting
                </a>
            )}
        </div>
    );
}

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
                <p className="text-ink-secondary">{previous ? `Cleared: ${previous}` : ""}</p>
                <p className="text-action sm:text-center">Current: {STAGES[stageIndex]}</p>
                <p className="text-ink-secondary sm:text-right">{next ? `Next: ${next}` : ""}</p>
            </div>
        </div>
    );
}

// Ref "active card.png" (collapsed) and "acive card view.png" (expanded).
function ApplicationCard({ application, job, onWithdraw }) {
    const [expanded, setExpanded] = useState(false);
    const stageIndex = STAGES.indexOf(application.status);
    const active = stageIndex !== -1;

    const location = job?.location ? `${job.location}${job.modeOfWork ? ` (${job.modeOfWork})` : ""}` : null;
    const department = job?.categories?.[0];

    return (
        <article className="flex flex-col gap-4 rounded-xl border border-[#e6e9ee] bg-white p-6 shadow-[0px_1px_3px_rgba(14,43,75,0.06)] sm:px-8">
            <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2 text-sm leading-[1.4]">
                    {active ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-[#d9efe3] px-3 py-1 text-[#00a05a]">
                            <span className="size-1.5 rounded-full bg-[#00a05a]" aria-hidden />
                            Stage {stageIndex + 1} of {STAGES.length}: {application.status}
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-border-strong">
                            <span className="size-1.5 rounded-full bg-border-strong" aria-hidden />
                            {application.status}
                        </span>
                    )}
                    {job?.jobCode && (
                        <span className="rounded-full bg-[#eef2f8] px-3 py-1 text-ink-secondary">Job ID: {job.jobCode}</span>
                    )}
                </div>

                <h2 className="text-2xl leading-[1.2] font-medium text-ink">
                    {job ? (
                        <Link href={`/jobs/${job.slug}`} className="transition-colors hover:text-action">
                            {application.position}
                        </Link>
                    ) : (
                        application.position
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
                    {active && application.interview && <InterviewPanel interview={application.interview} />}
                    {active && <ProgressPanel stageIndex={stageIndex} />}

                    {/* A resume is required to apply, so the row always shows. */}
                    <div className="flex flex-wrap items-center gap-2 border-t border-[#e6e9ee] pt-4 text-sm leading-[1.4] text-ink-secondary">
                        <span className="mr-1">Submitted:</span>
                        <span className={chipClass}>
                            <FileIcon />
                            {application.resumeName || "Resume"}
                        </span>
                        {application.portfolio && (
                            <a
                                href={application.portfolio}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${chipClass} transition-colors hover:bg-[#e6e9ee]`}
                            >
                                <LinkIcon />
                                Portfolio
                            </a>
                        )}
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
                            if (window.confirm(`Withdraw your application for ${application.position}?`)) onWithdraw();
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

// Ref "active.png": Active / Inactive tabs on a white bar under the header,
// then one full-width card per application. `jobs` is every open job, loaded
// on the server; an application only records the position title, so its
// location and department come from the open job of that title.
export default function MyApplications({ jobs }) {
    const applications = useApplications();
    const [tab, setTab] = useState("active");

    const jobsByTitle = Object.fromEntries(jobs.map((job) => [job.title, job]));
    const visible = (applications ?? []).filter((application) => isActive(application) === (tab === "active"));

    return (
        <>
            <div className="w-full bg-white px-4 shadow-[0px_4px_8px_rgba(0,0,0,0.06)] sm:px-16">
                <h1 className="sr-only">My Applications</h1>
                <div role="tablist" className="flex items-center gap-8">
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
                                    selected
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

            <section className="w-full px-4 pt-8 pb-16 sm:px-16">
                {applications === null ? (
                    <div className="h-[175px] w-full animate-pulse rounded-xl bg-neutral-100" aria-busy="true" />
                ) : visible.length === 0 ? (
                    <div className="flex flex-col items-start gap-4 py-6">
                        <p className="text-base leading-[1.5] text-ink-secondary">
                            {tab === "active" ? "You have no active applications." : "You have no inactive applications."}
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
                        {visible.map((application) => {
                            const key = applicationKey(application);
                            return (
                                <li key={key}>
                                    <ApplicationCard
                                        application={application}
                                        job={jobsByTitle[application.position]}
                                        onWithdraw={() => withdrawApplication(key)}
                                    />
                                </li>
                            );
                        })}
                    </ul>
                )}
            </section>
        </>
    );
}
