"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import moreIcon from "@/assets/HrCommon/icons/more-20.svg";
import HrListHeader from "@/components/HrCommon/HrListHeader";
import HrMenu from "@/components/HrCommon/HrMenu";
import HrPagination from "@/components/HrCommon/HrPagination";
import HrStatusPill from "@/components/HrCommon/HrStatusPill";
import HrTabs from "@/components/HrCommon/HrTabs";
import { hrCell, hrHeadCell, hrHeadRow, hrMoreButton, hrRow, hrTable } from "@/components/HrCommon/hrTableStyles";
import useHrList, { ALL } from "@/components/HrCommon/useHrList";
import { JOB_STATUSES, jobOpenings } from "./jobOpeningsData";

const statusFor = Object.fromEntries(JOB_STATUSES.map((status) => [status.value, status]));

const COLUMNS = ["Job ID", "Job Position", "Dept", "Type", "Vacancies", "Applications", "Closing", "Status"];
const CENTRED = new Set(["Vacancies", "Applications"]);

// Figma 1921:3445: active job openings. Tabs, the title row and the table
// are 32 apart in 32 gutters; rows are 66 tall.
export default function JobOpenings() {
    const router = useRouter();
    const list = useHrList(jobOpenings, { pageSize: 7 });

    const tabs = [{ value: ALL, label: "All" }, ...JOB_STATUSES].map((tab) => ({
        ...tab,
        count: list.countFor(tab.value),
    }));
    const filterOptions = [{ value: ALL, label: "All", filterLabel: "All Statuses" }, ...JOB_STATUSES];

    return (
        <div className="flex flex-col gap-8 px-4 pt-8 pb-8 sm:px-8 lg:group-data-[sidebar=open]/hr:pl-4">
            <HrTabs label="Job status" tabs={tabs} value={list.filter} onChange={list.setFilter} />
            <HrListHeader
                title="Active Job Openings"
                filterLabel="Filter by status"
                options={filterOptions}
                value={list.filter}
                onChange={list.setFilter}
            />

            <section aria-label="Job openings">
                <div className="overflow-x-auto [contain:paint]">
                    <table className={`${hrTable} min-w-[960px]`}>
                        <thead>
                            <tr className={hrHeadRow}>
                                {COLUMNS.map((column) => (
                                    <th
                                        key={column}
                                        scope="col"
                                        className={`${hrHeadCell} ${column === "Job ID" ? "" : "uppercase"} ${CENTRED.has(column) ? "text-center" : ""}`}
                                    >
                                        {column}
                                    </th>
                                ))}
                                <th scope="col" className="w-[83px]">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.pageRows.map((job) => (
                                <tr key={job.id} className={`${hrRow} h-[66px]`}>
                                    <td className={hrCell}>{job.id}</td>
                                    <td className={hrCell}>
                                        <Link href="/hr/candidates" className="text-action hover:underline">
                                            {job.title}
                                        </Link>
                                    </td>
                                    <td className={hrCell}>{job.department}</td>
                                    <td className={hrCell}>{job.type}</td>
                                    <td className={`${hrCell} text-center`}>{job.vacancies}</td>
                                    <td className={`${hrCell} text-center`}>{job.applications}</td>
                                    <td className={hrCell}>{job.closing}</td>
                                    <td className={hrCell}>
                                        <HrStatusPill tone={statusFor[job.status].tone}>{statusFor[job.status].label}</HrStatusPill>
                                    </td>
                                    <td className="px-6 text-right">
                                        <HrMenu
                                            label={`More actions for ${job.id}`}
                                            className={hrMoreButton}
                                            items={[{ label: "View Candidates", onSelect: () => router.push("/hr/candidates") }]}
                                        >
                                            <Image src={moreIcon} alt="" className="size-5" />
                                        </HrMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {list.pageRows.length === 0 && (
                    <p className="border-t border-border-default px-6 py-8 text-center text-sm text-muted-ink">
                        No job openings with this status.
                    </p>
                )}
                <div className="flex justify-end border-t border-border-default px-6 pt-[17px] pb-4">
                    <HrPagination page={list.page} pageCount={list.pageCount} onChange={list.setPage} />
                </div>
            </section>
        </div>
    );
}
