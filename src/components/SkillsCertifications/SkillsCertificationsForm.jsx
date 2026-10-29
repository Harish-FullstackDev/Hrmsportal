"use client";

import Image from "next/image";

import closeIcon from "@/assets/Apply/icons/close-16.svg";
import { ApplyTagPicker } from "@/components/Apply/ApplyCombobox";
import { ApplySelect, ApplyTextInput } from "@/components/Apply/ApplyFormControls";
import { skills as skillOptions } from "@/components/ExperienceEducation/experienceOptions";
import Certifications from "@/components/SkillsCertifications/Certifications";

export const MAX_SKILLS = 6;

// Kinds of work link a candidate can add; each link row picks one.
export const LINK_TYPES = ["Portfolio", "GitHub", "Behance", "Dribbble", "Personal Website", "Other"];
export const MAX_LINKS = 5;
const emptyLink = () => ({ type: LINK_TYPES[0], url: "" });

export const emptySkillsCertifications = {
    skills: [],
    // [{ name, provider, month, year, fileName }]
    // TODO: send the certificate files once the backend takes them; only the
    // file name is kept for now.
    certifications: [],
    links: [emptyLink()],
};

// Answers saved before the redesign kept certifications as plain names, and
// some kept one `portfolio` string; read them in the current shape.
export const certificationsOf = (values) => (values.certifications ?? []).filter((item) => item && typeof item === "object");
export const workLinks = (values) =>
    values.links ?? (values.portfolio ? [{ type: LINK_TYPES[0], url: values.portfolio }] : [emptyLink()]);

const linkId = (index) => `workLink-${index}`;

const URL_PATTERN = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i;

// Returns { field: message } for every invalid field; empty when valid.
export function validateSkillsCertifications(values) {
    const errors = {};
    if (!(values.skills?.length > 0)) errors.skills = "Add at least one skill.";
    workLinks(values).forEach((link, index) => {
        if (link.url.trim() && !URL_PATTERN.test(link.url.trim())) errors[linkId(index)] = "Enter a valid link.";
    });
    return errors;
}

// Figma 1878:21590, extended to several links: each row picks the kind of
// link and takes its URL (the field 417 wide, as in Figma); rows can be added
// up to MAX_LINKS and removed. Optional.
function WorkLinks({ links, errors, onChange }) {
    const update = (index, field, value) =>
        onChange(
            links.map((link, i) => (i === index ? { ...link, [field]: value } : link)),
            index,
        );

    return (
        <section aria-labelledby="work-links-label" className="flex flex-col gap-3 rounded-xl bg-white p-6">
            <label id="work-links-label" htmlFor={linkId(0)} className="text-base leading-[1.2] font-medium text-[#374151]">
                Portfolio, GitHub or Other Work links
            </label>
            <ul className="flex flex-col gap-3">
                {links.map((link, index) => (
                    <li key={index} className="flex flex-col gap-1 motion-safe:animate-[apply-check-in_200ms_ease-out_both]">
                        <div className="flex items-center gap-3">
                            <div className="w-[150px] shrink-0">
                                <ApplySelect
                                    id={`${linkId(index)}-type`}
                                    name={`${linkId(index)}-type`}
                                    aria-label="Link type"
                                    value={link.type}
                                    onChange={(event) => update(index, "type", event.target.value)}
                                    options={LINK_TYPES}
                                    placeholder="Link type"
                                />
                            </div>
                            <div className="min-w-0 flex-1 lg:max-w-[417px] lg:flex-none lg:basis-[417px]">
                                <ApplyTextInput
                                    id={linkId(index)}
                                    name={linkId(index)}
                                    type="url"
                                    autoComplete="url"
                                    aria-label={`${link.type} link`}
                                    value={link.url}
                                    onChange={(event) => update(index, "url", event.target.value)}
                                    placeholder="Enter your link"
                                    invalid={Boolean(errors[linkId(index)])}
                                    describedBy={errors[linkId(index)] ? `${linkId(index)}-message` : undefined}
                                />
                            </div>
                            {links.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => onChange(links.filter((_, i) => i !== index), index)}
                                    aria-label={`Remove ${link.type} link`}
                                    className="flex size-[42px] shrink-0 cursor-pointer items-center justify-center rounded-lg bg-[#f8f9fa] transition-colors hover:bg-surface-brand-subtle"
                                >
                                    <Image src={closeIcon} alt="" width={16} height={16} />
                                </button>
                            )}
                        </div>
                        {errors[linkId(index)] && (
                            <p id={`${linkId(index)}-message`} className="text-xs leading-[1.4] text-required">
                                {errors[linkId(index)]}
                            </p>
                        )}
                    </li>
                ))}
            </ul>
            {links.length < MAX_LINKS && (
                <button
                    type="button"
                    onClick={() => onChange([...links, emptyLink()], links.length)}
                    className="w-fit cursor-pointer rounded-lg bg-surface-brand-subtle px-4 py-2 text-xs leading-[1.4] text-action transition-colors hover:bg-primary-200/50"
                >
                    + Add another link
                </button>
            )}
        </section>
    );
}

// Figma 1878:21407: stage 4 of the application. A Skills card (the picker,
// 417 wide, with the picked skills beside it), the Certifications section,
// and the work links card.
export default function SkillsCertificationsForm({ values, errors, onChange }) {
    const setValue = (field, value) => onChange({ ...values, [field]: value }, field);

    return (
        <div className="flex w-full flex-col gap-8">
            <section aria-labelledby="skills-label" className="flex flex-col gap-3 rounded-xl bg-white p-6">
                <label id="skills-label" htmlFor="skillsPicker" className="text-base leading-[1.2] font-medium text-[#374151]">
                    Skills <span className="text-[#ef4444]">*</span>
                </label>
                <ApplyTagPicker
                    id="skillsPicker"
                    value={values.skills ?? []}
                    onChange={(next) => setValue("skills", next)}
                    options={skillOptions}
                    max={MAX_SKILLS}
                    placeholder="Search or add a skill"
                    fullPlaceholder="Maximum skills reached"
                    limitMessage={`Maximum ${MAX_SKILLS} skills allowed`}
                    listLabel="Selected skills"
                    tagsBeside
                    muted
                    invalid={Boolean(errors.skills)}
                    describedBy={errors.skills ? "skillsPicker-message" : undefined}
                />
                {errors.skills && (
                    <p id="skillsPicker-message" className="text-xs leading-[1.4] text-required">
                        {errors.skills}
                    </p>
                )}
            </section>

            <Certifications value={certificationsOf(values)} onChange={(next) => setValue("certifications", next)} />

            <WorkLinks
                links={workLinks(values)}
                errors={errors}
                onChange={(next, index) => {
                    // Drop the old single-link answer once the list is edited.
                    const { portfolio: _, ...rest } = values;
                    onChange({ ...rest, links: next }, linkId(index));
                }}
            />
        </div>
    );
}
