import { Suspense } from "react";

import JobsShell from "@/components/Jobs/JobsShell";
import MyApplications from "@/components/Jobs/MyApplications";
import MyProfile from "@/components/Profile/MyProfile";
import { listMyApplications } from "@/lib/applications/queries";

export const metadata = {
    title: "My Profile · HRMS Portal",
};

async function MyApplicationsData() {
    const applications = await listMyApplications();
    return <MyApplications applications={applications} embedded />;
}

// The applications read the candidate's session, so they render per request.
export default function Page() {
    return (
        <JobsShell>
            <MyProfile
                applications={
                    <Suspense fallback={<div className="h-[175px] w-full animate-pulse rounded-xl bg-neutral-100" aria-busy="true" />}>
                        <MyApplicationsData />
                    </Suspense>
                }
            />
        </JobsShell>
    );
}
