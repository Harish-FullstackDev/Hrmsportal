import PortalHeader from "@/components/CommonComponents/PortalHeader";

// Shared frame of the job pages (Search Jobs, a job, Saved Jobs, My
// Application): the signed-in header, then the page. Ported from the
// website's CandidateShell; the header's links replace its candidate tabs.
export default function JobsShell({ children }) {
    return (
        <div className="flex min-h-dvh w-full flex-1 flex-col bg-white font-switzer text-ink">
            <PortalHeader showProfileLink />
            <main className="flex w-full flex-1 flex-col">{children}</main>
        </div>
    );
}
