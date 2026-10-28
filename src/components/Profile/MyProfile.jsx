"use client";

import { useState } from "react";
import Image from "next/image";

import addCalendarIcon from "@/assets/Profile/icons/add-calendar.svg";
import calendarIcon from "@/assets/Profile/icons/card-calendar.svg";
import departmentIcon from "@/assets/Profile/icons/card-department.svg";
import cardPinIcon from "@/assets/Profile/icons/card-pin.svg";
import videoIcon from "@/assets/Profile/icons/interview-video.svg";
import joinMeetingIcon from "@/assets/Profile/icons/join-meeting.svg";
import mailIcon from "@/assets/Profile/icons/mail.svg";
import phoneIcon from "@/assets/Profile/icons/phone.svg";
import pinIcon from "@/assets/Profile/icons/pin.svg";
import shieldIcon from "@/assets/Profile/icons/shield.svg";
import portrait from "@/assets/Profile/portrait.jpg";

// TODO: replace with the candidate's profile and applications once the
// backend serves them. Copy is Figma 1867:3464's sample data.
const PROFILE = {
    name: "Eleanor Vance",
    headline: ["Senior Product Designer & Systems Architect", "Platform Experience Tier"],
    email: "eleanor.vance@example.com",
    phone: "+1 (555) 234-8901",
    location: "San Francisco, CA, United States",
};

const APPLICATIONS = [
    {
        id: "000764697",
        status: "active",
        stage: "Stage 3 of 5: Technical Portfolio Review",
        title: "Senior Product Designer – Design Systems & Core UX",
        location: "San Francisco, CA (Hybrid)",
        department: "Product & Experience Design",
        applied: "Applied Oct 12, 2024",
        interview: {
            label: "Google Meet Link Ready",
            title: "Upcoming Interview: Technical Deep Dive",
            when: "Thursday, Oct 25, 2024 at 2:00 PM – 3:15 PM PST (75 mins)",
            link: "#",
        },
        progress: {
            title: "Portfolio Review & Deep Dive",
            step: "Stage 3 of 5",
            percent: 60,
            cleared: "Cleared: Recruiter Screen",
            scheduled: "Scheduled: Tomorrow, 2:00 PM",
            next: "Next: Exec Panel & Offer",
        },
    },
];

const TABS = [
    { key: "active", label: "Active" },
    { key: "withdrawn", label: "Withdraw" },
];

function PageHeading({ as: Heading = "h1", title, children }) {
    return (
        <div className="flex flex-col gap-1">
            <Heading className="text-[28px] leading-[1.2] font-medium capitalize text-ink sm:text-[32px]">{title}</Heading>
            <p className="text-base leading-[1.5] text-[#444651]">{children}</p>
        </div>
    );
}

function IconText({ icon, className = "gap-2", children }) {
    return (
        <span className={`flex items-center ${className}`}>
            <Image src={icon} alt="" aria-hidden className="shrink-0" />
            {children}
        </span>
    );
}

// Figma 1867:3590: portrait in the first two of 12 columns, the identity
// text from column 4.
function Identity() {
    return (
        <div className="flex flex-col gap-6 sm:flex-row sm:gap-12 lg:gap-[136px]">
            <div className="relative h-[208px] w-[176px] shrink-0 overflow-hidden rounded bg-[#e5eeff] shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
                <Image src={portrait} alt={PROFILE.name} fill sizes="176px" priority className="object-cover" />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-6 pt-1">
                <div className="flex flex-col gap-2">
                    <h2 className="pt-1 text-[28px] leading-[1.2] font-medium capitalize text-[#0b1c30] sm:text-[32px]">
                        {PROFILE.name}
                    </h2>
                    <p className="flex flex-wrap items-center gap-2 text-sm leading-[1.4] text-[#4d556b]">
                        {PROFILE.headline.map((part, index) => (
                            <span key={part} className="flex items-center gap-2">
                                {index > 0 && (
                                    <span aria-hidden className="text-xl leading-[27.5px] tracking-[-0.3px] text-[#c3c6d7]">
                                        /
                                    </span>
                                )}
                                {part}
                            </span>
                        ))}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-1 py-2 text-sm leading-[1.4] text-[#0b1c30]">
                        <IconText icon={mailIcon} className="gap-1">
                            <a href={`mailto:${PROFILE.email}`} className="hover:text-action">
                                {PROFILE.email}
                            </a>
                        </IconText>
                        <span aria-hidden className="text-[#c3c6d7]">
                            •
                        </span>
                        <IconText icon={phoneIcon}>{PROFILE.phone}</IconText>
                    </div>
                    <div className="py-2 text-sm leading-[1.4] text-[#0b1c30]">
                        <IconText icon={pinIcon}>{PROFILE.location}</IconText>
                    </div>
                </div>

                <p className="flex items-start gap-2 pt-6 text-[13px] leading-[18px] text-border-strong">
                    <Image src={shieldIcon} alt="" aria-hidden className="mt-0.5 shrink-0" />
                    Official verified talent dossier. Read-only record managed via Executive Talent Operations.
                    Direct adjustments require Partner delegation.
                </p>
            </div>
        </div>
    );
}

// Figma 1867:3680: the scheduled interview, with meeting and calendar links.
function InterviewPanel({ interview }) {
    return (
        <div className="flex flex-col gap-4 rounded-xl border border-[rgba(199,196,216,0.3)] bg-[rgba(239,244,255,0.7)] p-[21px] md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-[14px]">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-action">
                    <Image src={videoIcon} alt="" aria-hidden />
                </span>
                <div className="flex flex-col gap-0.5">
                    <p className="text-xs leading-[1.4] text-action">{interview.label}</p>
                    <h4 className="text-lg leading-[1.2] font-medium text-[#0b1c30]">{interview.title}</h4>
                    <p className="text-xs leading-[1.4] text-[#464555]">{interview.when}</p>
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
                <a
                    href={interview.link}
                    className="flex items-center gap-2 rounded-lg bg-action px-4 py-2 text-xs leading-[1.4] text-white shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors hover:bg-[#005192]"
                >
                    <Image src={joinMeetingIcon} alt="" aria-hidden />
                    Join Meeting
                </a>
                <button
                    type="button"
                    className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[rgba(199,196,216,0.3)] bg-white px-[13px] py-[9px] text-xs leading-[1.4] text-[#0b1c30] transition-colors hover:border-action"
                >
                    <Image src={addCalendarIcon} alt="" aria-hidden />
                    Add to Calendar
                </button>
            </div>
        </div>
    );
}

// Figma 1867:3703: stage progress bar with the stages either side.
function ProgressPanel({ progress }) {
    return (
        <div className="flex flex-col gap-2 rounded-xl bg-[#eff4ff] p-4 text-xs leading-[1.4]">
            <div className="flex items-center justify-between gap-4">
                <p className="text-[#0b1c30]">{progress.title}</p>
                <p className="text-action">{progress.step}</p>
            </div>
            <div
                role="progressbar"
                aria-label={progress.title}
                aria-valuenow={progress.percent}
                aria-valuemin={0}
                aria-valuemax={100}
                className="h-2 w-full overflow-hidden rounded-full bg-[#e5eeff]"
            >
                <div className="h-full rounded-full bg-action" style={{ width: `${progress.percent}%` }} />
            </div>
            <div className="flex flex-col gap-1 pt-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[#464555]">{progress.cleared}</p>
                <p className="text-action">{progress.scheduled}</p>
                <p className="text-[#464555]">{progress.next}</p>
            </div>
        </div>
    );
}

// Figma 1867:3654.
function ApplicationCard({ application }) {
    return (
        <article className="flex flex-col gap-6 rounded-2xl border border-[rgba(199,196,216,0.3)] bg-white p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] sm:p-[33px]">
            <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2 pb-2 text-xs leading-[1.4]">
                    <span className="flex items-center gap-1.5 rounded-full bg-[#d9ebe0] px-3 py-1 text-[#008e59]">
                        <span aria-hidden className="size-2 rounded-full bg-[#008e59]" />
                        {application.stage}
                    </span>
                    <span className="rounded-full bg-[#eff4ff] px-2.5 py-1 text-muted-ink">Job ID: {application.id}</span>
                </div>
                <h3 className="text-xl leading-[1.2] font-medium capitalize text-[#0b1c30] sm:text-2xl">{application.title}</h3>
                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs leading-[1.4] text-[#464555]">
                    <IconText icon={cardPinIcon} className="gap-1.5">
                        {application.location}
                    </IconText>
                    <IconText icon={departmentIcon} className="gap-1.5">
                        {application.department}
                    </IconText>
                    <IconText icon={calendarIcon} className="gap-1.5">
                        {application.applied}
                    </IconText>
                </div>
            </div>

            {application.interview && <InterviewPanel interview={application.interview} />}
            {application.progress && <ProgressPanel progress={application.progress} />}
            <div className="h-[29px] border-t border-[rgba(199,196,216,0.2)]" />
        </article>
    );
}

function Applications() {
    const [tab, setTab] = useState("active");
    const visible = APPLICATIONS.filter((application) => application.status === tab);

    return (
        <div className="flex flex-col gap-8">
            <div role="tablist" className="flex h-[46px] items-center gap-6 border-b border-border-default bg-white pl-8">
                {TABS.map((item) => {
                    const selected = item.key === tab;
                    return (
                        <button
                            key={item.key}
                            type="button"
                            role="tab"
                            aria-selected={selected}
                            onClick={() => setTab(item.key)}
                            className={`cursor-pointer text-lg leading-[1.2] font-medium transition-colors ${
                                selected ? "text-action" : "text-muted-ink hover:text-ink-secondary"
                            }`}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>

            {visible.length === 0 ? (
                <p className="text-base leading-[1.5] text-ink-secondary">You have no withdrawn applications.</p>
            ) : (
                <ul className="flex flex-col gap-6">
                    {visible.map((application) => (
                        <li key={application.id}>
                            <ApplicationCard application={application} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

// Figma 1867:3464: the candidate's identity, then their applications.
// Shows sample data for now (see PROFILE and APPLICATIONS above).
export default function MyProfile() {
    return (
        <div className="flex w-full flex-col px-4 pt-8 pb-16 sm:px-16">
            <section className="flex flex-col gap-[35px] pb-8">
                <PageHeading title="My Profile">
                    Manage your professional identity, career qualifications, and recruiter exposure.
                </PageHeading>
                <Identity />
            </section>

            <section className="flex flex-col gap-4 border-t border-border-default pt-6">
                <PageHeading as="h2" title="My Applications">
                    Review status, upcoming interviews, and progression stages across all active opportunities.
                </PageHeading>
                <Applications />
            </section>
        </div>
    );
}
