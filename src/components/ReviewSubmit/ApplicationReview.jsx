"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import checkOff from "@/assets/Apply/icons/doc-check-off-16.svg";
import checkOn from "@/assets/Apply/icons/doc-check-on-16.svg";
import { FileChip } from "@/components/Apply/ApplyFilePicker";
import { loadDocumentFile } from "@/components/Apply/applicationStorage";
import { applyStepHref } from "@/components/Apply/applySteps";
import { experienceSummary } from "@/components/ExperienceEducation/ExperienceEducationForm";
import { phoneCodeFor } from "@/components/PersonalDetails/PersonalDetailsForm";
import { certificationsOf, workLinks } from "@/components/SkillsCertifications/SkillsCertificationsForm";
import { DOCUMENTS_LIST } from "@/components/UploadDocuments/UploadDocumentsForm";
import { ReviewCard, ReviewField, ReviewGrid, ReviewTags } from "@/components/ReviewSubmit/ReviewParts";

const phone = (code, number) => (number ? `${phoneCodeFor(code).code} ${number}` : "");

// Object URL for a file kept in this browser (see applicationStorage), or
// null while loading or when there is none.
function useDocumentUrl(field, fileName) {
    const [file, setFile] = useState(null);
    useEffect(() => {
        let cancelled = false;
        if (fileName) loadDocumentFile(field).then((found) => !cancelled && setFile(found));
        return () => {
            cancelled = true;
        };
    }, [field, fileName]);
    const url = useMemo(() => (fileName && file ? URL.createObjectURL(file) : null), [fileName, file]);
    useEffect(() => () => url && URL.revokeObjectURL(url), [url]);
    return url;
}

// Figma 1878:22139: the resume itself in a scrolling grey frame (PDFs show
// inline; Word files can't, so they show their name with a link instead).
function ResumePreview({ resume, url }) {
    if (!resume) return <p className="text-sm leading-[1.4] text-hint">No resume uploaded</p>;
    if (resume.type === "application/pdf") {
        return (
            <div className="h-[471px] w-full overflow-hidden rounded-lg bg-[#f8f9fa] p-3 lg:px-[120px] lg:py-6">
                <iframe src={url} title={`Resume: ${resume.name}`} className="size-full rounded bg-white" />
            </div>
        );
    }
    return (
        <a href={url} target="_blank" rel="noreferrer" className="w-fit hover:underline">
            <FileChip name={resume.name} />
        </a>
    );
}

// Figma 1878:22197: the photograph (240 square) and signature (240 x 120 on
// white) on a grey panel.
function PhotoAndSignature({ documents }) {
    const photoUrl = useDocumentUrl("photograph", documents.photograph);
    const signatureUrl = useDocumentUrl("signature", documents.signature);
    const frame = "relative overflow-hidden rounded flex items-center justify-center text-xs text-hint";

    return (
        <div className="flex w-full flex-col gap-6 rounded-xl bg-[#f8f9fa] p-6 lg:w-[552px] lg:shrink-0">
            <p className="text-sm leading-[1.4] text-ink">Photograph &amp; Signature</p>
            <div className="flex flex-wrap items-center gap-6">
                <div className={`${frame} size-[240px] bg-white`}>
                    {photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element -- a local object URL
                        <img src={photoUrl} alt="Your photograph" className="size-full object-cover" />
                    ) : (
                        "No photograph"
                    )}
                </div>
                <div className={`${frame} h-[120px] w-[240px] bg-white`}>
                    {signatureUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element -- a local object URL
                        <img src={signatureUrl} alt="Your signature" className="max-h-[71px] max-w-[157px] object-contain" />
                    ) : (
                        "No signature"
                    )}
                </div>
            </div>
        </div>
    );
}

// Figma 1878:22147: each other document with its file and a tick once
// attached (the photograph and signature show in the panel instead).
function DocumentList({ documents }) {
    const rows = DOCUMENTS_LIST.filter(({ field }) => field !== "photograph" && field !== "signature");
    return (
        <ul className="flex min-w-0 flex-1 flex-col gap-6">
            {rows.map(({ field, label, multiple }) => {
                const files = multiple ? documents[field] ?? [] : documents[field] ? [documents[field]] : [];
                return (
                    <li
                        key={field}
                        className="grid grid-cols-[1fr_auto] items-center gap-x-5 gap-y-2 border-b border-neutral-100 py-2 last:border-b-0 md:grid-cols-[minmax(0,296px)_1fr_auto]"
                    >
                        <span className="text-sm leading-[1.4] text-black">{label}</span>
                        <span className="col-span-2 row-start-2 flex flex-wrap gap-2 md:col-span-1 md:row-start-1 md:col-start-2">
                            {files.map((name, index) => (
                                <FileChip key={`${name}-${index}`} name={name} />
                            ))}
                        </span>
                        <Image
                            src={files.length > 0 ? checkOn : checkOff}
                            alt={files.length > 0 ? "Attached" : "Not attached"}
                            width={16}
                            height={16}
                            className="col-start-2 row-start-1 md:col-start-3"
                        />
                    </li>
                );
            })}
        </ul>
    );
}

// Figma 1878:21982 onwards: stage 6's cards, one per earlier stage, each
// echoing that stage's answers read-only with an Edit link back to it.
// `data` is the apply context's stepData; missing answers show "Not provided".
export default function ApplicationReview({ resume, resumeUrl, data }) {
    const personal = data["personal-details"] ?? {};
    const experience = data["experience-and-education"] ?? {};
    const skills = data["skills-and-certifications"] ?? {};
    const documents = data["upload-documents"] ?? {};

    const links = workLinks(skills).filter((link) => link.url.trim());

    return (
        <div className="flex w-full flex-col gap-8">
            <ReviewCard title="Personal Details" editHref={applyStepHref(1)}>
                <ReviewGrid>
                    <ReviewField label="First Name" value={personal.firstName} />
                    <ReviewField label="Sur Name" value={personal.surname} />
                    <ReviewField label="Last Name" value={personal.lastName} />
                    <ReviewField label="Email" value={personal.email} />
                    <ReviewField label="Mobile Number" value={phone(personal.phoneCode, personal.phone)} />
                    <ReviewField label="Gender" value={personal.gender} />
                    <ReviewField label="PAN No." value={personal.pan} />
                    <ReviewField label="Country" value={personal.country} />
                    <ReviewField label="State" value={personal.state} />
                    <ReviewField label="City" value={personal.city} />
                    <ReviewField
                        label="Languages"
                        value={(personal.languages ?? []).map(({ language, fluency }) => `${language} (${fluency})`).join(", ")}
                    />
                    {personal.altPhone && (
                        <ReviewField label="Alternate Mobile Number" value={phone(personal.altPhoneCode, personal.altPhone)} />
                    )}
                    {personal.linkedIn && <ReviewField label="LinkedIn Profile URL" value={personal.linkedIn} />}
                </ReviewGrid>
            </ReviewCard>

            <ReviewCard title="Experience and Education" editHref={applyStepHref(2)}>
                <ReviewGrid>
                    {experienceSummary(experience).map(({ field, label, value }) => (
                        <ReviewField
                            key={field}
                            label={label}
                            value={field === "realWorldWork" && Array.isArray(value) ? value.join(", ") : value}
                            className={field === "workHistory" ? "md:col-span-2" : ""}
                        />
                    ))}
                </ReviewGrid>
            </ReviewCard>

            <ReviewCard title="Skills and Certifications" editHref={applyStepHref(3)}>
                <ReviewTags
                    label="Certifications"
                    items={certificationsOf(skills).map(({ name, provider, month, year }) => (
                        <>
                            {name} <span className="text-ink-secondary">| {provider} | {`${month} ${year}`}</span>
                        </>
                    ))}
                />
                <ReviewTags label="Skills" items={skills.skills ?? []} />
                {links.length > 0 && (
                    <ReviewTags label="Portfolio, GitHub or Other Work links" items={links.map((link) => `${link.type}: ${link.url.trim()}`)} />
                )}
            </ReviewCard>

            <ReviewCard title="Resume" editHref={applyStepHref(0)}>
                <ResumePreview resume={resume} url={resumeUrl} />
            </ReviewCard>

            <ReviewCard title="Upload Documents" editHref={applyStepHref(4)}>
                <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16">
                    <DocumentList documents={documents} />
                    <PhotoAndSignature documents={documents} />
                </div>
            </ReviewCard>
        </div>
    );
}
