"use client";

import { createContext, useContext, useState } from "react";
import { usePathname } from "next/navigation";

import PortalHeader from "@/components/CommonComponents/PortalHeader";
import { ApplicationProvider, RestoredOnly } from "@/components/Apply/ApplicationContext";
import ApplyStepperNav from "@/components/Apply/ApplyStepperNav";
import { applySteps } from "@/components/Apply/applySteps";
import JobHero from "@/components/JobDetails/JobHero";

// Direction of the last stage change ("next" or "back"), read by ApplyStage.
const DirectionContext = createContext("next");
export const useApplyDirection = () => useContext(DirectionContext);

// The job being applied for (mapJob in lib/jobs.js), read by the stages.
const JobContext = createContext(null);
export const useApplyJob = () => useContext(JobContext);

// Shared frame of the apply stages (Figma 1878:19400 onwards, 1440 wide, on
// the #f8f9fa page surface): white header, the job banner, then the stepper
// 32 under it and the stage content 32 under the stepper, all 64 from the
// screen edges. The current stage comes from the URL. The stepper animates
// its own rail and circles and lets reached stages be clicked
// (ApplyStepperNav); each stage wraps its content in ApplyStage. `job` is
// picked by the /apply layout.
export default function ApplyShell({ job, children }) {
    const pathname = usePathname();
    const currentIndex = Math.max(
        0,
        applySteps.findIndex(({ slug }) => pathname.endsWith(`/${slug}`)),
    );
    // Admin data can repeat a value (location "Hybrid" with mode "Hybrid").
    const tags = [...new Set([job.typeOfWork, job.modeOfWork, job.location].filter(Boolean))];

    // Derived when the index changes (state-from-props pattern).
    const [track, setTrack] = useState({ index: currentIndex, direction: "next" });
    if (track.index !== currentIndex) {
        setTrack({ index: currentIndex, direction: currentIndex > track.index ? "next" : "back" });
    }

    return (
        // Keyed by job, so starting another job's application begins afresh.
        <ApplicationProvider key={job.slug} jobSlug={job.slug}>
            <JobContext.Provider value={job}>
                <DirectionContext.Provider value={track.direction}>
                    <div className="flex min-h-dvh w-full flex-1 flex-col bg-[#f8f9fa] font-switzer text-ink">
                        <div className="bg-white">
                            <PortalHeader showProfileLink />
                        </div>
                        <JobHero title={job.title} reference={job.jobCode} tags={tags} />
                        <main className="flex w-full flex-1 flex-col gap-8 overflow-x-clip px-4 pt-8 pb-12 sm:px-16">
                            <ApplyStepperNav currentIndex={currentIndex} />
                            <RestoredOnly>{children}</RestoredOnly>
                        </main>
                    </div>
                </DirectionContext.Provider>
            </JobContext.Provider>
        </ApplicationProvider>
    );
}
