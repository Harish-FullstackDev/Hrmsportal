"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import successCheck from "@/assets/Apply/icons/success-check-30.svg";
import { useApplication } from "@/components/Apply/ApplicationContext";
import useStageForm from "@/components/Apply/useStageForm";
import ApplyStage from "@/components/Apply/ApplyStage";
import ApplyStepFooter from "@/components/Apply/ApplyStepFooter";
import { applyStepHref, applySteps } from "@/components/Apply/applySteps";
import { isStageComplete } from "@/components/Apply/stageCompletion";
import { useApplyJob } from "@/components/Apply/ApplyShell";
import { recordApplication, recordProfile } from "@/components/Jobs/candidateStorage";
import { phoneCodeFor } from "@/components/PersonalDetails/PersonalDetailsForm";
import ApplicationReview from "@/components/ReviewSubmit/ApplicationReview";
import { Declaration, HeardFrom, emptyReviewExtras, validateReviewExtras } from "@/components/ReviewSubmit/ReviewExtras";

// Figma frame 1878:21894: stage 6 of 6. Shows every answer for a last check,
// then asks how they heard about us and the declaration. Submit checks those
// first, then re-checks all stages and lists any that are incomplete.
// TODO: send the application to the backend; for now Submit only records it
// in this browser, for My Application.
const ReviewSubmitPage = () => {
    const job = useApplyJob();
    const { resume, resumeUrl, stepData, setStepData, submitted, setSubmitted } = useApplication();
    const [incomplete, setIncomplete] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [referenceId, setReferenceId] = useState(null);
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
        // TODO: use the reference the backend issues.
        const reference = `ASC-${String(crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000).padStart(6, "0")}`;
        setReferenceId(reference);
        recordApplication({ id: crypto.randomUUID(), reference, position: job.title, resumeName: resume?.name });
        const personal = stepData["personal-details"] ?? {};
        const roles = stepData["experience-and-education"]?.workHistory ?? [];
        const latestRole = roles.find((role) => role.current === "Yes") ?? roles.at(-1);
        recordProfile({
            phone: personal.phone ? `${phoneCodeFor(personal.phoneCode).code} ${personal.phone}` : "",
            location: [personal.city, personal.state, personal.country].filter(Boolean).join(", "),
            jobTitle: latestRole?.jobTitle ?? "",
            employer: latestRole?.organization ?? "",
        });
        setTimeout(() => {
            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 600);
    };

    // Figma 1878:22325: green tick tile, heading, the reference on a light
    // blue pill, and the link to My Profile (where the applications are
    // listed), 32 apart. The shell hides the stepper once submitted.
    // TODO: send the confirmation email once the backend submits applications.
    if (submitted) {
        return (
            <ApplyStage className="flex flex-col items-center px-4 py-16 text-center">
                <div role="status" className="flex flex-col items-center gap-8">
                    <span className="flex size-16 items-center justify-center rounded-xl bg-[rgba(25,128,56,0.1)] motion-safe:animate-[apply-check-in_400ms_ease-out_both]">
                        <Image src={successCheck} alt="" width={30} height={30} />
                    </span>
                    <div className="flex flex-col items-center gap-2">
                        <h2 className="text-2xl leading-[1.2] font-medium text-[#161616] capitalize sm:text-[32px]">
                            Application was submitted successfully
                        </h2>
                        <p className="text-sm leading-[1.4] text-[#525252]">We have sent a confirmation to your email.</p>
                    </div>
                    {referenceId && (
                        <p className="rounded-lg bg-surface-brand-subtle px-6 py-3 text-lg leading-[1.2] font-medium text-action">
                            APPLICATION_REF_ID: {referenceId}
                        </p>
                    )}
                    <Link
                        href="/my-profile"
                        className="rounded-lg bg-action px-6 py-3 text-lg leading-[1.2] font-medium text-white transition-colors hover:bg-[#005192]"
                    >
                        Go to My Application
                    </Link>
                </div>
            </ApplyStage>
        );
    }

    return (
        <ApplyStage className="flex flex-col gap-8">
            <h2 className="text-base leading-[1.2] font-medium text-ink">Check Your Details, then Submit Your Application.</h2>
            <ApplicationReview resume={resume} resumeUrl={resumeUrl} data={stepData} />
            <HeardFrom values={values} errors={errors} onChange={handleChange} />

            <div className="flex flex-col gap-8">
                <Declaration values={values} errors={errors} onChange={handleChange} />

                {incomplete.length > 0 && (
                    <div role="alert" className="rounded-lg border border-required bg-[#fdf2f2] px-4 py-3 text-sm leading-5 text-required">
                        <p>Please complete these steps before submitting:</p>
                        <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                            {incomplete.map(({ slug, label }) => (
                                <li key={slug}>
                                    <Link href={applyStepHref(applySteps.findIndex((step) => step.slug === slug))} className="underline">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <ApplyStepFooter
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
