import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import ApplyShell from "@/components/Apply/ApplyShell";
import { APPLY_JOB_COOKIE, getJobBySlug } from "@/lib/jobs";

// Header, banner and stepper stay mounted while the candidate moves between
// stages, and the in-progress application lives here. The job comes from
// the cookie /jobs/<slug>/apply sets; without one (or once the job closes)
// the candidate picks a job first.
export default async function ApplyLayout({ children }) {
    const slug = (await cookies()).get(APPLY_JOB_COOKIE)?.value;
    const job = slug ? await getJobBySlug(slug) : null;
    if (!job) redirect("/jobs");

    return <ApplyShell job={job}>{children}</ApplyShell>;
}
