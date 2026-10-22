"use client";

import { useState } from "react";
import Link from "next/link";

import { useApplication } from "@/components/Apply/ApplicationContext";
import useStageForm from "@/components/Apply/useStageForm";
import ApplyStage from "@/components/Apply/ApplyStage";
import ApplyStepFooter from "@/components/Apply/ApplyStepFooter";
import { applyStepHref, applySteps } from "@/components/Apply/applySteps";
import { isStageComplete } from "@/components/Apply/stageCompletion";
import { useApplyJob } from "@/components/Apply/ApplyShell";
import { recordApplication } from "@/components/Jobs/candidateStorage";
import ApplicationReview from "@/components/ReviewSubmit/ApplicationReview";
import {
    AdditionalInformation,
    Declaration,
    emptyReviewExtras,
    validateReviewExtras,
} from "@/components/ReviewSubmit/ReviewExtras";

// Figma frame 1403:11863: stage 6 of 6. Shows every answer for a last check,
// then asks the review's own questions (connection, source, referral) and the
// declaration. Submit checks those first, then re-checks all stages and lists
// any that are incomplete.
// TODO: send the application to the backend; for now Submit only records it
// in this browser, for My Application.
const ReviewSubmitPage = () => {
    const job = useApplyJob();
    const { resume, resumeUrl, stepData, setStepData } = useApplication();
    const [incomplete, setIncomplete] = useState([]);
    const [status, setStatus] = useState("idle"); // idle | submitting | submitted
    const { values, errors, handleChange, handleBack, validateNow } = useStageForm({
        slug: "review-and-submit",
        initial: emptyReviewExtras,
        validate: validateReviewExtras,
        nextIndex: 5,
    });

    const handleSubmit = () => {
        if (!validateNow()) return;
        setStepData("review-and-submit", values);

        const missing = applySteps.slice(0, 5).filter((_, index) => !isStageComplete(index, { resume, stepData }));
        setIncomplete(missing);
        if (missing.length > 0) return;

        setStatus("submitting");
        recordApplication({ id: crypto.randomUUID(), position: job.title, resumeName: resume?.name });
        setTimeout(() => setStatus("submitted"), 600);
    };

    return (
        <ApplyStage className="flex flex-col gap-8">
            <ApplicationReview resume={resume} resumeUrl={resumeUrl} role={job.title} data={stepData} />
            <AdditionalInformation values={values} errors={errors} onChange={handleChange} />

            <div className="mt-4 flex flex-col gap-6">
                <Declaration values={values} errors={errors} onChange={handleChange} />

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
                        Thank you! Your application for {job.title} is ready. (Submission isn&apos;t connected to the server
                        yet; it is listed under <Link href="/my-applications" className="underline">My Application</Link> in
                        this browser.)
                    </p>
                )}

                <ApplyStepFooter
                    buttons
                    backHref={applyStepHref(4)}
                    onBack={handleBack}
                    onNext={handleSubmit}
                    nextLabel={status === "submitting" ? "Submitting…" : status === "submitted" ? "Submitted" : "Submit"}
                    busy={status !== "idle"}
                />
            </div>
        </ApplyStage>
    );
};

export default ReviewSubmitPage;
