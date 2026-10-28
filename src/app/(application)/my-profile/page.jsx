import JobsShell from "@/components/Jobs/JobsShell";
import MyProfile from "@/components/Profile/MyProfile";

export const metadata = {
    title: "My Profile · HRMS Portal",
};

export default function Page() {
    return (
        <JobsShell>
            <MyProfile />
        </JobsShell>
    );
}
