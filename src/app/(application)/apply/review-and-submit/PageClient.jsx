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
    const { resume, resumeUrl, stepData, setStepData, submitted, setSubmitted } = useApplication();
    const [incomplete, setIncomplete] = useState([]);
    const [submitting, setSubmitting] = useState(false);
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

        setSubmitting(true);
        recordApplication({ id: crypto.randomUUID(), position: job.title, resumeName: resume?.name });
        setTimeout(() => {
            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 600);
    };

    if (submitted) {
        return (
            <ApplyStage className="flex flex-col items-center px-4 pt-16 pb-24 text-center">
                <div role="status" className="flex max-w-[460px] flex-col items-center">
                    <svg aria-hidden="true" width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-[#008e59]">
                        <path d="M4 12.5l5 5L20 6.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h2 className="mt-3 text-[32px] leading-[1.2] font-medium text-navy-900">Thank You</h2>
                    <p className="mt-4 text-sm leading-[1.6] text-muted-ink">
                        Your application form has been successfully submitted and an email notification will be sent to
                        you shortly. Please refer to your email for the next step.
                    </p>
                    <Link
                        href="/my-applications"
                        className="mt-8 rounded-[7px] border border-action bg-action px-4 py-2 text-base leading-[1.5] text-white transition-colors hover:bg-action/90"
                    >
                        View My Applications
                    </Link>
                </div>
            </ApplyStage>
        );
    }

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

                <ApplyStepFooter
                    buttons
                    backHref={applyStepHref(4)}
                    onBack={handleBack}
                    onNext={handleSubmit}
                    nextLabel={submitting ? "Submitting…" : "Submit"}
                    busy={submitting}
                />
            </div>
        </ApplyStage>
    );
};

export default ReviewSubmitPage;
