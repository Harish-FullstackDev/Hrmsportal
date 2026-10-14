"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useApplication } from "@/components/Apply/ApplicationContext";
import ApplyStage from "@/components/Apply/ApplyStage";
import ApplyStepFooter from "@/components/Apply/ApplyStepFooter";
import { applyStepHref } from "@/components/Apply/applySteps";
import UploadResume from "@/components/UploadResume/UploadResume";

// Figma frame 1380:3059: stage 1 of 6. Next needs a resume; Back returns to
// the job details.
const UploadResumePage = () => {
    const router = useRouter();
    const { resume } = useApplication();
    const [error, setError] = useState(null);

    const handleNext = () => {
        if (!resume) {
            setError("Upload your resume to continue.");
            return;
        }
        router.push(applyStepHref(1));
    };

    return (
        // Figma puts stage 1 48 under the stepper (16 more than the shell gives).
        <ApplyStage className="flex flex-col gap-12 pt-4">
            <UploadResume error={error} onError={setError} />
            <ApplyStepFooter backHref="/job-details" onNext={handleNext} />
        </ApplyStage>
    );
};

export default UploadResumePage;
