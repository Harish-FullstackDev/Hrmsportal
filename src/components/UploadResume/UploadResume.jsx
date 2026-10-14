"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";

import cloudUpload from "@/assets/Apply/icons/cloud-upload-32.svg";
import deleteIcon from "@/assets/Apply/icons/delete-16.svg";
import { useApplication } from "@/components/Apply/ApplicationContext";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "application/pdf", "image/svg+xml"];
const MAX_BYTES = 5 * 1024 * 1024;

// Checks a picked/dropped file; returns an error message or null.
export function validateResume(file) {
    if (!ACCEPTED_TYPES.includes(file.type)) return "Upload a PNG, JPG, PDF or SVG file.";
    if (file.size > MAX_BYTES) return "The file is larger than 5 MB.";
    return null;
}

// Figma 1380:3113: stage 1 of the application. Heading and hints, a 548-wide
// dashed drop zone (click or drag a file onto it), and once a file is in, its
// name as a link plus a delete icon 24 below the zone.
export default function UploadResume({ error, onError }) {
    const { resume, resumeUrl, setResume } = useApplication();
    const inputRef = useRef(null);
    const inputId = useId();
    const errorId = useId();
    const [dragging, setDragging] = useState(false);

    const takeFile = (file) => {
        if (!file) return;
        const problem = validateResume(file);
        onError(problem);
        if (!problem) setResume(file);
    };

    const openPicker = () => inputRef.current?.click();

    return (
        <section className="flex w-full flex-col gap-6">
            <div className="flex flex-col gap-[13px]">
                <div className="flex flex-col gap-1 text-sm leading-5">
                    <h2 className="text-lg leading-[1.2] font-medium text-[#000412]">Upload Resume</h2>
                    <p className="text-ink">
                        <label htmlFor={inputId}>Resume/CV</label>
                        <span className="ml-2 text-muted-ink">PNG, JPG, PDF &amp; SVG Max 5.0 MB</span>
                    </p>
                    <p className="text-muted-ink">
                        Drag and Drop Your File here or{" "}
                        <button type="button" onClick={openPicker} className="cursor-pointer text-action hover:underline">
                            Browse File
                        </button>
                    </p>
                </div>

                <input
                    ref={inputRef}
                    id={inputId}
                    type="file"
                    accept={ACCEPTED_TYPES.join(",")}
                    aria-describedby={error ? errorId : undefined}
                    className="sr-only"
                    onChange={(event) => {
                        takeFile(event.target.files?.[0]);
                        event.target.value = "";
                    }}
                />

                <button
                    type="button"
                    onClick={openPicker}
                    onDragOver={(event) => {
                        event.preventDefault();
                        setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(event) => {
                        event.preventDefault();
                        setDragging(false);
                        takeFile(event.dataTransfer.files?.[0]);
                    }}
                    className={`flex h-[94px] w-full max-w-[548px] cursor-pointer flex-col items-center justify-center gap-[9px] rounded-lg border-[0.5px] border-dashed bg-surface-brand-subtle transition-colors ${
                        dragging ? "border-action bg-primary-200/40" : error ? "border-required" : "border-border-strong"
                    }`}
                >
                    <Image src={cloudUpload} alt="" width={32} height={32} />
                    <span className="text-sm leading-5 text-muted-ink">Upload Resume</span>
                </button>

                {error && (
                    <p id={errorId} role="alert" className="text-sm leading-5 text-required">
                        {error}
                    </p>
                )}
            </div>

            {resume && (
                <div className="flex items-center gap-[15px]">
                    <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm leading-5 text-action underline"
                    >
                        {resume.name}
                    </a>
                    <button
                        type="button"
                        onClick={() => setResume(null)}
                        aria-label={`Remove ${resume.name}`}
                        className="cursor-pointer"
                    >
                        <Image src={deleteIcon} alt="" width={16} height={16} />
                    </button>
                </div>
            )}
        </section>
    );
}
