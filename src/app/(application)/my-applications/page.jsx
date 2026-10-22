import JobsShell from "@/components/Jobs/JobsShell";
import MyApplications from "@/components/Jobs/MyApplications";
import { getAllJobs } from "@/lib/jobs";

export const metadata = {
    title: "My Applications · HRMS Portal",
};

export default async function Page() {
    const jobs = await getAllJobs();

    return (
        <JobsShell>
            <MyApplications jobs={jobs} />
        </JobsShell>
    );
}
