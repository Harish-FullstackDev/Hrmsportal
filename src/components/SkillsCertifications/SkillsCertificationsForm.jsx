import { ApplyTagPicker } from "@/components/Apply/ApplyCombobox";
import { ApplySelect, ApplyTextInput } from "@/components/Apply/ApplyFormControls";
import { skills as skillOptions } from "@/components/ExperienceEducation/experienceOptions";
import RoleSkillsCheck from "@/components/SkillsCertifications/RoleSkillsCheck";

export const MAX_SKILLS = 6;

// Suggestions for the certification field; free text is allowed too.
const certificationOptions = [
    "Google UX Design Certificate",
    "IxDF UI/UX Design",
    "Figma Academy",
    "Nielsen Norman Group UX Certification",
    "Certified Usability Analyst (CUA)",
    "Adobe Certified Professional",
    "Interaction Design Foundation",
    "Human Factors International CXA",
];

// Kinds of work link a candidate can add; each link row picks one.
export const LINK_TYPES = ["Portfolio", "GitHub", "Behance", "Dribbble", "Personal Website", "Other"];
export const MAX_LINKS = 5;
const emptyLink = () => ({ type: LINK_TYPES[0], url: "" });

export const emptySkillsCertifications = {
    skills: [],
    roleSkills: {},
    certifications: [],
    links: [emptyLink()],
};

// The candidate's work links. Answers saved before links existed kept a
// single `portfolio` string.
export const workLinks = (values) =>
    values.links ?? (values.portfolio ? [{ type: LINK_TYPES[0], url: values.portfolio }] : [emptyLink()]);

const linkId = (index) => `workLink-${index}`;

const URL_PATTERN = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i;

// Returns { field: message } for every invalid field; empty when valid.
export function validateSkillsCertifications(values) {
    const errors = {};
    if (values.skills.length === 0) errors.skills = "Add at least one skill.";

    const ticked = Object.entries(values.roleSkills);
    if (ticked.length === 0) errors.roleSkills = "Tick at least one skill you have.";
    else if (ticked.some(([, level]) => !level)) errors.roleSkills = "Choose a level for every ticked skill.";

    workLinks(values).forEach((link, index) => {
        if (link.url.trim() && !URL_PATTERN.test(link.url.trim())) errors[linkId(index)] = "Enter a valid link.";
    });
    return errors;
}

function FieldLabel({ htmlFor, required, children }) {
    return (
        <label htmlFor={htmlFor} className="text-lg leading-[1.2] font-medium text-[#374151]">
            {children}
            {required && <span className="ml-1 text-[#ef4444]">*</span>}
        </label>
    );
}

function FieldError({ id, children }) {
    return children ? (
        <p id={id} className="text-xs leading-[1.4] text-required">
            {children}
        </p>
    ) : null;
}

// Portfolio, GitHub and other work links: each row picks the kind of link and
// takes its URL; rows can be added (up to MAX_LINKS) and removed. Optional.
function WorkLinks({ links, errors, onChange }) {
    const update = (index, field, value) =>
        onChange(
            links.map((link, i) => (i === index ? { ...link, [field]: value } : link)),
            index,
        );

    return (
        <div className="flex min-w-0 flex-col gap-2">
            <FieldLabel htmlFor={linkId(0)}>Portfolio, GitHub or Other Work links</FieldLabel>
            {links.map((link, index) => (
                <div key={index} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <div className="w-[150px] shrink-0">
                            <ApplySelect
                                id={`${linkId(index)}-type`}
                                name={`${linkId(index)}-type`}
                                value={link.type}
                                onChange={(event) => update(index, "type", event.target.value)}
                                options={LINK_TYPES}
                                placeholder="Link type"
                            />
                        </div>
                        {/* Figma draws this field grey (#f9fafb) like the certification one. */}
                        <div className="min-w-0 flex-1 [&_input]:bg-[#f9fafb] [&_input]:placeholder:text-hint">
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
                                className="flex size-[42px] shrink-0 items-center justify-center rounded-lg border border-border-default text-lg leading-none text-muted-ink transition-colors hover:border-required hover:text-required"
                            >
                                ×
                            </button>
                        )}
                    </div>
                    <FieldError id={`${linkId(index)}-message`}>{errors[linkId(index)]}</FieldError>
                </div>
            ))}
            {links.length < MAX_LINKS && (
                <button
                    type="button"
                    onClick={() => onChange([...links, emptyLink()], links.length)}
                    className="w-fit text-sm leading-5 font-medium text-action underline-offset-2 hover:underline"
                >
                    + Add another link
                </button>
            )}
        </div>
    );
}

// Figma 1380:3560: stage 4 of the application. Skills picker (label 8 above
// the field), the role's skills check panel 24 below it, then certification
// and work links side by side (417 wide, 20 apart) 32 below the panel.
export default function SkillsCertificationsForm({ values, errors, onChange, roleSkills }) {
    const setValue = (field, value) => onChange({ ...values, [field]: value }, field);

    return (
        <section aria-labelledby="skills-certifications-title" className="flex w-full flex-col gap-8">
            <h2 id="skills-certifications-title" className="sr-only">
                Skills and Certifications
            </h2>

            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <FieldLabel htmlFor="roleSkillsPicker" required>
                        Skills
                    </FieldLabel>
                    <ApplyTagPicker
                        id="roleSkillsPicker"
                        value={values.skills}
                        onChange={(next) => setValue("skills", next)}
                        options={skillOptions}
                        max={MAX_SKILLS}
                        placeholder="Search or add a skill"
                        fullPlaceholder="Maximum skills reached"
                        limitMessage={`Maximum ${MAX_SKILLS} skills allowed`}
                        listLabel="Selected skills"
                        invalid={Boolean(errors.skills)}
                        describedBy={errors.skills ? "roleSkillsPicker-message" : undefined}
                    />
                    <FieldError id="roleSkillsPicker-message">{errors.skills}</FieldError>
                </div>

                <RoleSkillsCheck
                    id="roleSkills"
                    skills={roleSkills}
                    value={values.roleSkills}
                    onChange={(next) => setValue("roleSkills", next)}
                    error={errors.roleSkills}
                />
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-[417px_417px]">
                <div className="flex min-w-0 flex-col gap-2">
                    <FieldLabel htmlFor="certifications">
                        Certification
                    </FieldLabel>
                    <ApplyTagPicker
                        id="certifications"
                        value={values.certifications}
                        onChange={(next) => setValue("certifications", next)}
                        options={certificationOptions}
                        placeholder="Add Your Certification"
                        listLabel="Added certifications"
                        muted
                        chevron={false}
                        invalid={Boolean(errors.certifications)}
                        describedBy={errors.certifications ? "certifications-message" : undefined}
                    />
                    <FieldError id="certifications-message">{errors.certifications}</FieldError>
                </div>

                <WorkLinks
                    links={workLinks(values)}
                    errors={errors}
                    onChange={(next, index) => onChange({ ...values, links: next }, linkId(index))}
                />
            </div>
        </section>
    );
}
