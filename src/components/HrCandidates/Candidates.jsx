"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import moreIcon from "@/assets/HrCommon/icons/more-20.svg";
import HrListHeader from "@/components/HrCommon/HrListHeader";
import HrMenu from "@/components/HrCommon/HrMenu";
import HrPagination from "@/components/HrCommon/HrPagination";
import HrStatusPill from "@/components/HrCommon/HrStatusPill";
import HrTabs from "@/components/HrCommon/HrTabs";
import { hrCell, hrHeadCell, hrHeadRow, hrMoreButton, hrRow, hrTable } from "@/components/HrCommon/hrTableStyles";
import useHrList, { ALL } from "@/components/HrCommon/useHrList";
import CandidateProfileDrawer from "./CandidateProfileDrawer";
import { CANDIDATE_STAGES, CANDIDATE_STATUSES, candidates as initialCandidates, initialsOf } from "./candidatesData";

const statusFor = Object.fromEntries(CANDIDATE_STATUSES.map((status) => [status.value, status]));

const nextStage = (status) => {
    const index = CANDIDATE_STAGES.findIndex((stage) => stage.value === status);
    return index >= 0 ? CANDIDATE_STAGES[index + 1]?.value : undefined;
};

// Figma 1983:7824: candidates. Same frame as the job openings; rows are 81
// tall with an initials avatar, name and email. The row menu (Figma 1983:8867)
// opens the profile drawer (Figma 1983:8726) and moves a candidate on a stage.
export default function Candidates() {
    const [rows, setRows] = useState(initialCandidates);
    const [profileId, setProfileId] = useState(null);
    const list = useHrList(rows, { pageSize: 6 });

    const setStatus = (id, status) =>
        setRows((current) => current.map((row) => (row.id === id ? { ...row, status } : row)));

    const tabs = [{ value: ALL, label: "All" }, ...CANDIDATE_STAGES].map((tab) => ({
        ...tab,
        count: list.countFor(tab.value),
    }));
    const filterOptions = [{ value: ALL, label: "All", filterLabel: "All Statuses" }, ...CANDIDATE_STATUSES];
    const profile = rows.find((row) => row.id === profileId);

    return (
        <div className="flex flex-col gap-8 px-4 pt-8 pb-8 sm:px-8 lg:group-data-[sidebar=open]/hr:pl-4">
            <HrTabs label="Candidate stage" tabs={tabs} value={list.filter} onChange={list.setFilter} />
            <HrListHeader
                title="Candidates"
                filterLabel="Filter by status"
                options={filterOptions}
                value={list.filter}
                onChange={list.setFilter}
            />

            <section aria-label="Candidates">
                <div className="overflow-x-auto [contain:paint]">
                    <table className={`${hrTable} min-w-[960px]`}>
                        <thead>
                            <tr className={hrHeadRow}>
                                <th scope="col" className={hrHeadCell}>
                                    Candidates
                                </th>
                                {["Job Position", "Dept", "Type", "AI Match", "Status"].map((column) => (
                                    <th key={column} scope="col" className={`${hrHeadCell} uppercase`}>
                                        {column}
                                    </th>
                                ))}
                                <th scope="col" className="w-[83px]">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.pageRows.map((candidate) => {
                                const next = nextStage(candidate.status);
                                return (
                                    <tr key={candidate.id} className={`${hrRow} h-[81px]`}>
                                        <td className={hrCell}>
                                            <div className="flex items-center gap-3">
                                                <span
                                                    aria-hidden="true"
                                                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-action text-xs leading-[1.4] text-[#f8f9fa]"
                                                >
                                                    {initialsOf(candidate.name)}
                                                </span>
                                                <div className="flex flex-col gap-0.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setProfileId(candidate.id)}
                                                        className="text-left hover:text-action hover:underline"
                                                    >
                                                        {candidate.name}
                                                    </button>
                                                    <a href={`mailto:${candidate.email}`} className="text-xs text-action hover:underline">
                                                        {candidate.email}
                                                    </a>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={hrCell}>
                                            <Link href="/hr/job-openings" className="text-action hover:underline">
                                                {candidate.jobTitle}
                                            </Link>
                                        </td>
                                        <td className={hrCell}>{candidate.department}</td>
                                        <td className={hrCell}>{candidate.type}</td>
                                        <td className={hrCell}>{candidate.match}%</td>
                                        <td className={hrCell}>
                                            <HrStatusPill tone={statusFor[candidate.status].tone}>
                                                {statusFor[candidate.status].label}
                                            </HrStatusPill>
                                        </td>
                                        <td className="px-6 text-right">
                                            <HrMenu
                                                label={`More actions for ${candidate.name}`}
                                                className={hrMoreButton}
                                                items={[
                                                    { label: "View Profile", onSelect: () => setProfileId(candidate.id) },
                                                    { label: "View Resume", onSelect: () => setProfileId(candidate.id) },
                                                    { label: "Schedule Interview" },
                                                    ...(next
                                                        ? [{ label: "Move to Next Stage", onSelect: () => setStatus(candidate.id, next) }]
                                                        : []),
                                                    { label: "View Application History", onSelect: () => setProfileId(candidate.id) },
                                                ]}
                                            >
                                                <Image src={moreIcon} alt="" className="size-5" />
                                            </HrMenu>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {list.pageRows.length === 0 && (
                    <p className="border-t border-border-default px-6 py-8 text-center text-sm text-muted-ink">
                        No candidates at this stage.
                    </p>
                )}
                <div className="flex justify-end border-t border-border-default px-6 pt-[17px] pb-4">
                    <HrPagination page={list.page} pageCount={list.pageCount} onChange={list.setPage} />
                </div>
            </section>

            {profile && (
                <CandidateProfileDrawer candidate={profile} onClose={() => setProfileId(null)} onStatusChange={setStatus} />
            )}
        </div>
    );
}
