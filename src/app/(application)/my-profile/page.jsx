import JobsShell from "@/components/Jobs/JobsShell";
import MyProfile from "@/components/Profile/MyProfile";
import { getAllJobs } from "@/lib/jobs";

export const metadata = {
    title: "My Profile · HRMS Portal",
};

export default async function Page() {
    const jobs = await getAllJobs();

    return (
        <JobsShell>
            <MyProfile jobs={jobs} />
        </JobsShell>
    );
}
