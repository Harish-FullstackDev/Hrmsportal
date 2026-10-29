"use client";

import { Fragment } from "react";

import { ApplyFilePicker, FileChip, openFilePicker } from "@/components/Apply/ApplyFilePicker";
import { messageIdFor } from "@/components/Apply/ApplyFormControls";
import { saveDocumentFile } from "@/components/Apply/applicationStorage";

const IMAGES = ["png", "jpg"];
const DOCUMENTS = ["pdf", "png", "jpg"];

// The documents asked for, in Figma's order. Additional certificates are
// optional and may be several files.
export const DOCUMENTS_LIST = [
    { field: "photograph", label: "Photograph", types: IMAGES },
    { field: "signature", label: "Signature", types: IMAGES },
    { field: "idProof", label: "ID Proof with Photograph", types: DOCUMENTS },
    { field: "tenthMarksheet", label: "10th Marksheet", types: DOCUMENTS },
    { field: "twelfthMarksheet", label: "12th Marksheet", types: DOCUMENTS },
    { field: "degreeCertificate", label: "Degree Certificate", types: DOCUMENTS },
    { field: "additionalCertificates", label: "Additional Certificates If Any", types: DOCUMENTS, multiple: true },
];

// File names; single documents' files are also kept in this browser
// (applicationStorage) for the review's previews.
// TODO: upload the files once the backend takes documents.
export const emptyUploadDocuments = Object.fromEntries(
    DOCUMENTS_LIST.map(({ field, multiple }) => [field, multiple ? [] : ""]),
);

// Returns { field: message } for every missing required document.
export function validateUploadDocuments(values) {
    const errors = {};
    for (const { field, label, multiple } of DOCUMENTS_LIST) {
        if (!multiple && !values[field]) errors[field] = `Upload your ${label.toLowerCase()}.`;
    }
    return errors;
}

const linkButton = "cursor-pointer px-3 py-2 text-sm leading-[1.4] underline";

// Figma 1878:21612: one row: label, the picker (480 wide), then the uploaded
// file and Edit / Delete, each set off by a thin divider.
function DocumentRow({ field, label, types, multiple, value, error, onChange, onError }) {
    const files = multiple ? value ?? [] : value ? [value] : [];

    return (
        <div className="flex flex-col gap-3 py-6 first:pt-0 last:pb-0">
            <label htmlFor={field} className="text-base leading-[1.2] font-medium text-[#374151]">
                {label}
                {!multiple && <span className="text-[#ef4444]"> *</span>}
            </label>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-0">
                <div className="w-full lg:w-[480px] lg:shrink-0">
                    <ApplyFilePicker
                        id={field}
                        label={label}
                        types={types}
                        // A single document shows its name in the field too; the list field stays ready for more.
                        fileName={multiple ? "" : value}
                        invalid={Boolean(error)}
                        describedBy={messageIdFor(field, { error })}
                        onPick={(file, problem) => {
                            if (problem) return onError(problem);
                            if (!multiple) saveDocumentFile(field, file);
                            onChange(multiple ? [...files, file.name] : file.name);
                        }}
                    />
                </div>
                {files.length > 0 && (
                    <ul className="flex flex-col gap-2 lg:ml-12 lg:flex-1 lg:border-l lg:border-border-default lg:pl-12">
                        {files.map((name, index) => (
                            <li key={`${name}-${index}`} className="flex min-h-[42px] items-center justify-between gap-4 motion-safe:animate-[apply-check-in_200ms_ease-out_both]">
                                <FileChip name={name} />
                                <span className="flex shrink-0 items-center gap-2 lg:border-l lg:border-border-default lg:pl-12">
                                    {!multiple && (
                                        <button
                                            type="button"
                                            onClick={() => openFilePicker(field)}
                                            className={`${linkButton} text-muted-ink hover:text-ink`}
                                        >
                                            Edit
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (!multiple) saveDocumentFile(field, null);
                                            onChange(multiple ? files.filter((_, i) => i !== index) : "");
                                        }}
                                        aria-label={`Delete ${name}`}
                                        className={`${linkButton} text-[#b43838] hover:text-required`}
                                    >
                                        Delete
                                    </button>
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {error && (
                <p id={`${field}-message`} role="alert" className="text-xs leading-[1.4] text-required">
                    {error}
                </p>
            )}
        </div>
    );
}

// Figma 1878:21612: stage 5 of the application. One white card listing each
// document to upload, rows divided by a thin line.
export default function UploadDocumentsForm({ values, errors, onChange, onError }) {
    return (
        <section aria-label="Upload Documents" className="flex w-full flex-col rounded-xl bg-white p-6">
            {DOCUMENTS_LIST.map((document, index) => (
                <Fragment key={document.field}>
                    {index > 0 && <hr className="border-border-default" />}
                    <DocumentRow
                        {...document}
                        value={values[document.field]}
                        error={errors[document.field]}
                        onChange={(next) => onChange({ ...values, [document.field]: next }, document.field)}
                        onError={(message) => onError(document.field, message)}
                    />
                </Fragment>
            ))}
        </section>
    );
}
