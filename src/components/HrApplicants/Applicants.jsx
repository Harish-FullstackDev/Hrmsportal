"use client";

import Image from "next/image";
import { useState } from "react";

import calendarIcon from "@/assets/HrApplicants/icons/calendar-16.svg";
import chevronSmallIcon from "@/assets/HrApplicants/icons/chevron-down-8.svg";
import chevronIcon from "@/assets/HrApplicants/icons/chevron-down-16.svg";
import editIcon from "@/assets/HrApplicants/icons/edit-16.svg";
import resumeIcon from "@/assets/HrApplicants/icons/resume-16x20.svg";
import sortIcon from "@/assets/HrApplicants/icons/sort-16.svg";
import HrMenu from "@/components/HrCommon/HrMenu";
import HrPagination from "@/components/HrCommon/HrPagination";
import ApplicantPanel from "./ApplicantPanel";
import {
    APPLICANT_STATUSES,
    APPLICANT_TABS,
    EMPLOYMENT_TYPES,
    applicants as initialApplicants,
    formatAppliedOn,
} from "./applicantsData";

const PAGE_SIZE = 5;
const ALL = "all";

const statusFor = Object.fromEntries(APPLICANT_STATUSES.map((status) => [status.value, status]));
const roles = [...new Set(initialApplicants.map((applicant) => applicant.role))].sort();

const SORTS = {
    newest: { label: "Newest first", compare: (a, b) => b.appliedOn.localeCompare(a.appliedOn) },
    oldest: { label: "Oldest first", compare: (a, b) => a.appliedOn.localeCompare(b.appliedOn) },
    "name-asc": { label: "Name A–Z", compare: (a, b) => a.name.localeCompare(b.name) },
    "name-desc": { label: "Name Z–A", compare: (a, b) => b.name.localeCompare(a.name) },
};

const DATE_RANGES = [
    { label: "Any date", days: null },
    { label: "Last 7 days", days: 7 },
    { label: "Last 30 days", days: 30 },
    { label: "Last 90 days", days: 90 },
];

// Date ranges are worked out when one is picked, never while rendering, so the
// page renders the same on the server and in the browser.
const isoDaysAgo = (days) => new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);

const quarterOf = (date) => Math.floor(date.getUTCMonth() / 3);
const isoDate = (year, month) => new Date(Date.UTC(year, month, 1)).toISOString().slice(0, 10);

// Each period is [label, from, until) as ISO dates, worked out on pick.
const PERIODS = [
    { label: "All Time", range: () => ({ label: "All Time" }) },
    {
        label: "This Quarter",
        range: () => {
            const now = new Date();
            const q = quarterOf(now);
            const year = now.getUTCFullYear();
            return { label: `This Quarter (Q${q + 1})`, from: isoDate(year, q * 3), until: isoDate(year, q * 3 + 3) };
        },
    },
    {
        label: "Last Quarter",
        range: () => {
            const now = new Date();
            const q = quarterOf(now) - 1;
            const year = now.getUTCFullYear();
            return {
                label: `Last Quarter (Q${((q + 4) % 4) + 1})`,
                from: isoDate(year, q * 3),
                until: isoDate(year, q * 3 + 3),
            };
        },
    },
    {
        label: "This Year",
        range: () => {
            const year = new Date().getUTCFullYear();
            return { label: `This Year (${year})`, from: isoDate(year, 0), until: isoDate(year + 1, 0) };
        },
    },
];

const filterButton =
    "flex h-[35px] items-center rounded bg-neutral-200 px-5 text-sm leading-[1.4] whitespace-nowrap text-ink transition-colors hover:bg-[#d9dde3]";
const headCell = "h-[52px] px-5 text-left text-sm leading-[1.4] font-normal text-[#555555]";
const cell = "px-5 text-sm leading-[1.4] text-[#16161a]";

// A filter menu whose button shows the picked option, or `placeholder` while
// nothing is picked.
function FilterMenu({ label, placeholder, options, value, onChange, className = "" }) {
    const picked = options.find((option) => option.value === value);
    return (
        <HrMenu
            label={label}
            items={options.map((option) => ({
                label: option.label,
                selected: option.value === value,
                onSelect: () => onChange(option.value),
            }))}
            className={`${filterButton} justify-between gap-6 ${className}`}
        >
            {value === ALL || !picked ? placeholder : picked.label}
            <Image src={chevronIcon} alt="" width={16} height={16} />
        </HrMenu>
    );
}

// Figma 2060:2170: the applicants list. A search and period bar, then a grey
// card with the title and filters, the stage tabs and the table. Opening an
// applicant (their name or View Resume) shows them in the side panel.
export default function Applicants() {
    const [rows, setRows] = useState(initialApplicants);
    const [query, setQuery] = useState("");
    const [tab, setTab] = useState(ALL);
    const [sort, setSort] = useState("newest");
    const [role, setRole] = useState(ALL);
    const [type, setType] = useState(ALL);
    const [dateRange, setDateRange] = useState({ label: DATE_RANGES[0].label, since: null });
    const [period, setPeriod] = useState({ label: "All Time" });
    const [page, setPage] = useState(1);
    const [selectedId, setSelectedId] = useState(null);

    // Any change to what's listed goes back to page 1.
    const refilter = (setter) => (value) => {
        setter(value);
        setPage(1);
    };

    const needle = query.trim().toLowerCase();
    const matchesFilters = (applicant) =>
        (!needle || [applicant.name, applicant.email, applicant.role].some((text) => text.toLowerCase().includes(needle))) &&
        (role === ALL || applicant.role === role) &&
        (type === ALL || applicant.type === type) &&
        (!dateRange.since || applicant.appliedOn >= dateRange.since) &&
        (!period.from || (applicant.appliedOn >= period.from && applicant.appliedOn < period.until));

    const matching = rows.filter(matchesFilters);
    const listed = matching.filter((applicant) => tab === ALL || applicant.status === tab).sort(SORTS[sort].compare);
    const pageCount = Math.max(1, Math.ceil(listed.length / PAGE_SIZE));
    const currentPage = Math.min(page, pageCount);
    const pageRows = listed.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
    const selected = rows.find((applicant) => applicant.id === selectedId);

    const tabs = [
        { value: ALL, label: "All Applicants" },
        ...APPLICANT_TABS.map((value) => ({ value, label: statusFor[value].label })),
    ];

    const setStatus = (id, status) =>
        setRows((current) => current.map((applicant) => (applicant.id === id ? { ...applicant, status } : applicant)));

    return (
        <div className="flex flex-col gap-8 px-4 pt-8 pb-8 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <label className="w-full max-w-[435px]">
                    <span className="sr-only">Search applicants</span>
                    <input
                        suppressHydrationWarning
                        type="search"
                        value={query}
                        onChange={(event) => refilter(setQuery)(event.target.value)}
                        placeholder="Search Jobs, Candidate, roles, etc..."
                        className="h-10 w-full rounded bg-surface-brand-subtle px-[18px] text-sm leading-[1.4] text-ink outline-none placeholder:text-ink focus:ring-2 focus:ring-action"
                    />
                </label>
                <div className="flex flex-wrap items-center gap-4">
                    <button
                        type="button"
                        className="flex h-10 w-[200px] items-center justify-center gap-2 rounded border border-action bg-white text-base leading-[1.2] text-action transition-colors hover:bg-surface-brand-subtle"
                    >
                        <Image src={editIcon} alt="" width={16} height={16} />
                        Modify your Dashboard
                    </button>
                    <HrMenu
                        label={`Period: ${period.label}`}
                        items={PERIODS.map((option) => ({
                            label: option.label,
                            selected: period.label.startsWith(option.label),
                            onSelect: () => refilter(setPeriod)(option.range()),
                        }))}
                        className="flex h-10 min-w-[142px] items-center justify-center gap-1.5 rounded bg-surface-tint px-2 text-sm leading-[1.4] whitespace-nowrap text-ink-body transition-colors hover:bg-[#e2eafc]"
                    >
                        <Image src={calendarIcon} alt="" width={16} height={16} />
                        {period.label}
                        <Image src={chevronSmallIcon} alt="" width={8} height={8} />
                    </HrMenu>
                </div>
            </div>

            <section
                aria-labelledby="applicants-title"
                className="flex flex-col gap-8 rounded-[18px] border border-neutral-100 bg-[#f8f8f8] px-4 pt-5 pb-5 sm:px-[30px]"
            >
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h1 id="applicants-title" className="text-xl leading-[1.2] font-medium text-[#16161a]">
                        Applicants List <span className="font-normal text-muted-ink">({listed.length.toLocaleString("en-US")})</span>
                    </h1>
                    <div className="flex flex-wrap items-center gap-2">
                        <HrMenu
                            label={`Sort by: ${SORTS[sort].label}`}
                            items={Object.entries(SORTS).map(([value, option]) => ({
                                label: option.label,
                                selected: value === sort,
                                onSelect: () => refilter(setSort)(value),
                            }))}
                            className={`${filterButton} gap-2.5`}
                        >
                            <Image src={sortIcon} alt="" width={16} height={16} />
                            Sort By
                        </HrMenu>
                        <FilterMenu
                            label="Filter by role"
                            placeholder="Role"
                            options={[{ value: ALL, label: "All roles" }, ...roles.map((value) => ({ value, label: value }))]}
                            value={role}
                            onChange={refilter(setRole)}
                        />
                        <HrMenu
                            label={`Applied: ${dateRange.label}`}
                            items={DATE_RANGES.map((option) => ({
                                label: option.label,
                                selected: option.label === dateRange.label,
                                onSelect: () =>
                                    refilter(setDateRange)({
                                        label: option.label,
                                        since: option.days ? isoDaysAgo(option.days) : null,
                                    }),
                            }))}
                            className={`${filterButton} justify-between gap-6`}
                        >
                            {dateRange.since ? dateRange.label : "Date"}
                            <Image src={chevronIcon} alt="" width={16} height={16} />
                        </HrMenu>
                        <FilterMenu
                            label="Filter by employment type"
                            placeholder="Employment Type"
                            options={[{ value: ALL, label: "All types" }, ...EMPLOYMENT_TYPES.map((value) => ({ value, label: value }))]}
                            value={type}
                            onChange={refilter(setType)}
                            className="min-w-[185px]"
                        />
                    </div>
                </div>

                <div role="group" aria-label="Applicant stage" className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                    {tabs.map(({ value, label }) => {
                        const active = value === tab;
                        return (
                            <button
                                key={value}
                                type="button"
                                aria-pressed={active}
                                onClick={() => refilter(setTab)(value)}
                                className={`h-[41px] rounded-lg px-4 text-base leading-[1.2] whitespace-nowrap transition-colors ${
                                    active
                                        ? "bg-action text-white shadow-[0_2px_0_#aacc22]"
                                        : "text-ink-secondary hover:bg-neutral-200/60 hover:text-action"
                                }`}
                            >
                                {label}
                                {value !== ALL && (
                                    <span className="sr-only">
                                        {" "}
                                        ({matching.filter((applicant) => applicant.status === value).length})
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <div>
                    <div className="overflow-x-auto [contain:paint]">
                        <table className="w-full min-w-[940px] table-fixed border-collapse">
                            <colgroup>
                                <col className="w-[19%]" />
                                <col className="w-[17%]" />
                                <col className="w-[13%]" />
                                <col className="w-[15.5%]" />
                                <col className="w-[20.5%]" />
                                <col className="w-[15%]" />
                            </colgroup>
                            <thead>
                                <tr className="bg-neutral-200">
                                    <th scope="col" className={`${headCell} rounded-tl-lg`}>
                                        Name
                                    </th>
                                    <th scope="col" className={headCell}>
                                        Role
                                    </th>
                                    <th scope="col" className={headCell}>
                                        Date
                                    </th>
                                    <th scope="col" className={headCell}>
                                        Type
                                    </th>
                                    <th scope="col" className={headCell}>
                                        Resume
                                    </th>
                                    <th scope="col" className={`${headCell} rounded-tr-lg`}>
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageRows.map((applicant) => {
                                    const open = applicant.id === selectedId;
                                    const status = statusFor[applicant.status];
                                    return (
                                        <tr key={applicant.id} className="h-[86px]">
                                            <td className={cell}>
                                                <div className="flex flex-col gap-0.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedId(applicant.id)}
                                                        className="truncate text-left hover:text-action hover:underline"
                                                    >
                                                        {applicant.name}
                                                    </button>
                                                    <a
                                                        href={`mailto:${applicant.email}`}
                                                        className="truncate text-[#555555] hover:text-action hover:underline"
                                                    >
                                                        {applicant.email}
                                                    </a>
                                                </div>
                                            </td>
                                            <td className={cell}>{applicant.role}</td>
                                            <td className={cell}>{formatAppliedOn(applicant.appliedOn)}</td>
                                            <td className={cell}>{applicant.type}</td>
                                            <td className={cell}>
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedId(applicant.id)}
                                                    aria-label={`View resume of ${applicant.name}`}
                                                    className={`flex h-[34px] w-[147px] items-center justify-center gap-2.5 rounded-lg bg-primary-100 px-3 text-sm leading-[1.4] transition-colors hover:bg-primary-200 ${
                                                        open ? "text-ink" : "text-[#555555]"
                                                    }`}
                                                >
                                                    <Image src={resumeIcon} alt="" width={16} height={20} />
                                                    View Resume
                                                </button>
                                            </td>
                                            <td className={cell}>
                                                <span className="flex items-center gap-1.5">
                                                    <span aria-hidden="true" className={`size-3 shrink-0 rounded-[3.5px] ${status.swatch}`} />
                                                    {status.label}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {pageRows.length === 0 && (
                        <p className="px-6 py-10 text-center text-sm leading-[1.4] text-muted-ink">No applicants match these filters.</p>
                    )}
                    {pageCount > 1 && (
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
                            <p className="text-sm leading-[1.4] text-muted-ink">
                                Showing {(currentPage - 1) * PAGE_SIZE + 1}–{(currentPage - 1) * PAGE_SIZE + pageRows.length} of{" "}
                                {listed.length}
                            </p>
                            <HrPagination page={currentPage} pageCount={pageCount} onChange={setPage} />
                        </div>
                    )}
                </div>
            </section>

            {selected && (
                <ApplicantPanel
                    key={selected.id}
                    applicant={selected}
                    onClose={() => setSelectedId(null)}
                    onStatusChange={setStatus}
                />
            )}
        </div>
    );
}
