"use client";

import { useState } from "react";
import Link from "next/link";

import { useApplication } from "@/components/Apply/ApplicationContext";
import ApplyStage from "@/components/Apply/ApplyStage";
import ApplyStepFooter from "@/components/Apply/ApplyStepFooter";
import { applyStepHref, applySteps } from "@/components/Apply/applySteps";
import { validateAvailabilityCompensation } from "@/components/AvailabilityCompensation/AvailabilityCompensationForm";
import { validateExperienceEducation } from "@/components/ExperienceEducation/ExperienceEducationForm";
import { jobDetails } from "@/components/JobDetails/jobDetailsData";
import { validatePersonalDetails } from "@/components/PersonalDetails/PersonalDetailsForm";
import ApplicationReview from "@/components/ReviewSubmit/ApplicationReview";
import { validateSkillsCertifications } from "@/components/SkillsCertifications/SkillsCertificationsForm";

// Each form stage's validator, by slug. A stage with no saved data counts as
// incomplete.
const validators = {
    "personal-details": validatePersonalDetails,
    "experience-and-education": validateExperienceEducation,
    "skills-and-certifications": validateSkillsCertifications,
    "availability-and-compensation": validateAvailabilityCompensation,
};

// Figma frame 1403:11863: stage 6 of 6. Shows every answer for a last check.
// Submit re-checks all stages and lists any that are incomplete (e.g. after a
// reload, which clears the in-progress application).
// TODO: send the application to the backend; for now Submit only confirms.
const ReviewSubmitPage = () => {
    const { resume, resumeUrl, stepData } = useApplication();
    const [incomplete, setIncomplete] = useState([]);
    const [status, setStatus] = useState("idle"); // idle | submitting | submitted

    const handleSubmit = () => {
        const missing = applySteps.slice(0, 5).filter(({ slug }, index) => {
            if (index === 0) return !resume;
            const saved = stepData[slug];
            return !saved || Object.keys(validators[slug](saved)).length > 0;
        });
        setIncomplete(missing);
        if (missing.length > 0) return;

        setStatus("submitting");
        setTimeout(() => setStatus("submitted"), 600);
    };

    return (
        <ApplyStage className="flex flex-col gap-12">
            <ApplicationReview resume={resume} resumeUrl={resumeUrl} role={jobDetails.title} data={stepData} />

            {incomplete.length > 0 && (
                <div role="alert" className="rounded-lg border border-required bg-[#fdf2f2] px-4 py-3 text-sm leading-5 text-required">
                    <p>Please complete these steps before submitting:</p>
                    <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                        {incomplete.map(({ slug, label }) => (
                            <li key={slug}>
                                <Link href={applyStepHref(applySteps.findIndex((step) => step.slug === slug))} className="underline">
                                    {label.replace("\n", " ")}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {status === "submitted" && (
                <p role="status" className="rounded-lg border border-[#008e59] bg-[#d9ebe0] px-4 py-3 text-sm leading-5 text-[#00794c]">
                    Thank you! Your application for {jobDetails.title} is ready. (Submission isn&apos;t connected to the server yet.)
                </p>
            )}

            <ApplyStepFooter
                buttons
                backHref={applyStepHref(4)}
                onNext={handleSubmit}
                nextLabel={status === "submitting" ? "Submitting…" : status === "submitted" ? "Submitted" : "Submit"}
                busy={status !== "idle"}
            />
        </ApplyStage>
    );
};

export default ReviewSubmitPage;
