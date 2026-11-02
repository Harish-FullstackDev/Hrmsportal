import { Suspense } from "react";

import JobsShell from "@/components/Jobs/JobsShell";
import MyApplications from "@/components/Jobs/MyApplications";
import { listMyApplications } from "@/lib/applications/queries";

export const metadata = {
    title: "My Applications · HRMS Portal",
};

async function MyApplicationsData() {
    const applications = await listMyApplications();
    return <MyApplications applications={applications} />;
}

// The list reads the candidate's session, so it renders per request.
export default function Page() {
    return (
        <JobsShell>
            <Suspense fallback={<div className="mx-4 mt-8 h-[175px] animate-pulse rounded-xl bg-neutral-100 sm:mx-16" aria-busy="true" />}>
                <MyApplicationsData />
            </Suspense>
        </JobsShell>
    );
}
