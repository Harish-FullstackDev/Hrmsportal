import { Suspense } from "react";
import { notFound } from "next/navigation";

import JobForm from "@/components/HrJobForm/JobForm";
import { getJobForHr } from "@/lib/applications/queries";
import { jobValues } from "@/lib/jobs/jobForm";

export const metadata = {
    title: "Edit Job · HRMS Portal",
};

async function EditJob({ params }) {
    const { id } = await params;
    const job = await getJobForHr(id);
    if (!job) notFound();
    return <JobForm jobId={job.id} jobCode={job.job_code} initial={jobValues(job)} />;
}

// The job is read with the HR user's session, so this renders per request.
export default function Page({ params }) {
    return (
        <Suspense fallback={<div className="mx-4 my-8 h-[900px] max-w-[1152px] animate-pulse rounded-xl bg-neutral-100 sm:mx-8" />}>
            <EditJob params={params} />
        </Suspense>
    );
}
