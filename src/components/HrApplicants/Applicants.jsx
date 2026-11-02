"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";

import resumeIcon from "@/assets/HrApplicants/icons/resume-16x20.svg";
import {
    ALL,
    ALL_TIME,
    ANY_DATE,
    HrDateMenu,
    HrFilterMenu,
    HrListFooter,
    HrPeriodMenu,
    HrScrollTable,
    HrSearchField,
    HrSortMenu,
    HrStatus,
    hrCell,
    hrHeadCell,
    hrRowLine,
    paginate,
    useTopSearch,
    withinDates,
} from "@/components/HrCommon/HrListControls";
import { updateApplicationStatus } from "@/lib/applications/actions";
import ApplicantPanel from "./ApplicantPanel";
import { APPLICANT_STATUSES, EMPLOYMENT_TYPES, formatAppliedOn } from "./applicantsData";

const PAGE_SIZE = 5;

const statusFor = Object.fromEntries(APPLICANT_STATUSES.map((status) => [status.value, status]));

const SORTS = {
    newest: { label: "Newest first", compare: (a, b) => b.appliedOn.localeCompare(a.appliedOn) },
    oldest: { label: "Oldest first", compare: (a, b) => a.appliedOn.localeCompare(b.appliedOn) },
    "name-asc": { label: "Name A–Z", compare: (a, b) => a.name.localeCompare(b.name) },
    "name-desc": { label: "Name Z–A", compare: (a, b) => b.name.localeCompare(a.name) },
};

const COLUMNS = [
    { label: "Name", width: "w-[19%]" },
    { label: "Role", width: "w-[17.25%]" },
    { label: "Date", width: "w-[12.75%]" },
    { label: "Type", width: "w-[15.5%]" },
    { label: "Resume", width: "w-[20.5%]" },
    { label: "Status", width: "w-[15%]" },
];

// Figma 2060:2170: the applicants list. A search and period bar, then a grey
// card with the title and filters over a white table. Opening an applicant
// (their name or View Resume) shows them in the side panel. On desktop the
// page fits the screen; the table scrolls inside the card if it has to.
// `initialApplicants` come from listApplicationsForHr.
export default function Applicants({ initialApplicants }) {
    const router = useRouter();
    // Status changes made here, shown straight away while the server saves
    // them: { applicationId: status }.
    const [statusChanges, setStatusChanges] = useState({});
    const [statusError, setStatusError] = useState("");
    const [query, setQuery] = useState("");
    const topSearch = useTopSearch();
    const [status, setStatusFilter] = useState(ALL);
    const [sort, setSort] = useState("newest");
    const [role, setRole] = useState(ALL);
    const [type, setType] = useState(ALL);
    const [dateRange, setDateRange] = useState(ANY_DATE);
    const [period, setPeriod] = useState(ALL_TIME);
    const [page, setPage] = useState(1);
    const [selectedId, setSelectedId] = useState(null);

    // Next keeps this page mounted but hidden (React Activity) after navigating
    // away, so an open side panel would stay in the DOM and the HR shell would
    // keep making room for it on the next page. Close it as the page hides;
    // a layout effect so it's gone before the next page paints.
    useLayoutEffect(() => () => setSelectedId(null), []);

    // Any change to what's listed goes back to page 1.
    const refilter = (setter) => (value) => {
        setter(value);
        setPage(1);
    };

    const rows = initialApplicants.map((applicant) =>
        statusChanges[applicant.id] ? { ...applicant, status: statusChanges[applicant.id] } : applicant,
    );
    const roles = [...new Set(rows.map((applicant) => applicant.role))].sort();
    const matches = (needle) => (applicant) =>
        !needle || [applicant.name, applicant.email, applicant.role].some((text) => text.toLowerCase().includes(needle));
    const listed = rows
        .filter(
            (applicant) =>
                matches(query.trim().toLowerCase())(applicant) &&
                matches(topSearch)(applicant) &&
                (status === ALL || applicant.status === status) &&
                (role === ALL || applicant.role === role) &&
                (type === ALL || applicant.type === type) &&
                withinDates(applicant.appliedOn, dateRange, period),
        )
        .sort(SORTS[sort].compare);
    const paged = paginate(listed, page, PAGE_SIZE);
    const selected = rows.find((applicant) => applicant.id === selectedId);

    const setStatus = async (id, status) => {
        const previous = rows.find((applicant) => applicant.id === id)?.status;
        setStatusError("");
        setStatusChanges((current) => ({ ...current, [id]: status }));
        const result = await updateApplicationStatus(id, status);
        if (!result.ok) {
            setStatusChanges((current) => ({ ...current, [id]: previous }));
            setStatusError(result.error);
            return;
        }
        router.refresh();
    };

    return (
        <div className="flex flex-col gap-8 px-4 pt-8 pb-8 sm:px-8 lg:h-[calc(100dvh-83px)]">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <HrSearchField label="Search applicants" value={query} onChange={refilter(setQuery)} />
                <HrPeriodMenu value={period} onChange={refilter(setPeriod)} />
            </div>

            {statusError && (
                <p role="alert" className="rounded-lg border border-required bg-[#fdf2f2] px-4 py-3 text-sm leading-5 text-required">
                    {statusError}
                </p>
            )}

            <section
                aria-labelledby="applicants-title"
                className="flex flex-col gap-8 rounded-[18px] border border-neutral-100 bg-[#f8f8f8] px-4 pt-5 pb-[18px] sm:px-[30px] lg:min-h-0 lg:flex-1"
            >
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h1 id="applicants-title" className="text-xl leading-[1.2] font-medium text-[#16161a]">
                        Applicants List <span className="font-normal text-muted-ink">({listed.length.toLocaleString("en-US")})</span>
                    </h1>
                    <div className="flex flex-wrap items-center gap-2">
                        <HrSortMenu sorts={SORTS} value={sort} onChange={refilter(setSort)} />
                        <HrFilterMenu
                            label="Filter by status"
                            placeholder="Status"
                            options={[{ value: ALL, label: "All statuses" }, ...APPLICANT_STATUSES]}
                            value={status}
                            onChange={refilter(setStatusFilter)}
                        />
                        <HrFilterMenu
                            label="Filter by role"
                            placeholder="Role"
                            options={[{ value: ALL, label: "All roles" }, ...roles.map((value) => ({ value, label: value }))]}
                            value={role}
                            onChange={refilter(setRole)}
                        />
                        <HrDateMenu value={dateRange} onChange={refilter(setDateRange)} />
                        <HrFilterMenu
                            label="Filter by employment type"
                            placeholder="Employment Type"
                            options={[{ value: ALL, label: "All types" }, ...EMPLOYMENT_TYPES.map((value) => ({ value, label: value }))]}
                            value={type}
                            onChange={refilter(setType)}
                            className="min-w-[185px]"
                        />
                    </div>
                </div>

                {/* Figma 2060:2170: the table and pagination on white, the
                    header row grey with its top corners rounded. */}
                <div className="flex flex-col rounded-t-lg bg-white pb-[17px] lg:min-h-0 lg:flex-1">
                    <HrScrollTable
                        widths={COLUMNS.map(({ width }) => width)}
                        minWidth={922}
                        head={COLUMNS.map(({ label }) => (
                            <th key={label} scope="col" className={hrHeadCell}>
                                {label}
                            </th>
                        ))}
                        empty={
                            paged.pageRows.length === 0 && (
                                <p className="px-6 py-10 text-center text-sm leading-[1.4] text-muted-ink">No applicants match these filters.</p>
                            )
                        }
                    >
                        {paged.pageRows.map((applicant) => {
                            const open = applicant.id === selectedId;
                            const status = statusFor[applicant.status];
                            return (
                                <tr key={applicant.id} className={`h-[86px] ${hrRowLine}`}>
                                    <td className={hrCell}>
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
                                    <td className={hrCell}>{applicant.role}</td>
                                    <td className={hrCell}>{formatAppliedOn(applicant.appliedOn)}</td>
                                    <td className={hrCell}>{applicant.type}</td>
                                    <td className={hrCell}>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedId(applicant.id)}
                                            aria-label={`View resume of ${applicant.name}`}
                                            className={`flex h-[34px] w-[147px] items-center justify-center gap-2.5 rounded-lg bg-primary-100 px-3 text-xs leading-[1.4] transition-colors hover:bg-primary-200 ${
                                                open ? "text-ink" : "text-[#555555]"
                                            }`}
                                        >
                                            <Image src={resumeIcon} alt="" width={16} height={20} />
                                            View Resume
                                        </button>
                                    </td>
                                    <td className={hrCell}>
                                        <HrStatus swatch={status.swatch}>{status.label}</HrStatus>
                                    </td>
                                </tr>
                            );
                        })}
                    </HrScrollTable>
                    <HrListFooter
                        paged={paged}
                        total={listed.length}
                        onPageChange={setPage}
                        className="border-t border-neutral-100 px-[18px] pt-4"
                    />
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
