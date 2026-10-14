import { ApplyTagPicker } from "@/components/Apply/ApplyCombobox";
import { ApplyTextInput } from "@/components/Apply/ApplyFormControls";
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

export const emptySkillsCertifications = {
    skills: [],
    roleSkills: {},
    certifications: [],
    portfolio: "",
};

const URL_PATTERN = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i;

// Returns { field: message } for every invalid field; empty when valid.
export function validateSkillsCertifications(values) {
    const errors = {};
    if (values.skills.length === 0) errors.skills = "Add at least one skill.";

    const ticked = Object.entries(values.roleSkills);
    if (ticked.length === 0) errors.roleSkills = "Tick at least one skill you have.";
    else if (ticked.some(([, level]) => !level)) errors.roleSkills = "Choose a level for every ticked skill.";

    if (values.certifications.length === 0) errors.certifications = "Add at least one certification.";
    if (values.portfolio.trim() && !URL_PATTERN.test(values.portfolio.trim())) {
        errors.portfolio = "Enter a valid link.";
    }
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

// Figma 1380:3560: stage 4 of the application. Skills picker (label 8 above
// the field), the role's skills check panel 24 below it, then certification
// and portfolio side by side (417 wide, 20 apart) 32 below the panel.
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
                    <FieldLabel htmlFor="certifications" required>
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

                <div className="flex min-w-0 flex-col gap-2">
                    <FieldLabel htmlFor="portfolio">Portfolio, GitHub or Other Work link</FieldLabel>
                    {/* Figma draws this field grey (#f9fafb) like the certification one. */}
                    <div className="[&_input]:bg-[#f9fafb] [&_input]:placeholder:text-hint">
                        <ApplyTextInput
                            id="portfolio"
                            name="portfolio"
                            type="url"
                            autoComplete="url"
                            value={values.portfolio}
                            onChange={(event) => setValue("portfolio", event.target.value)}
                            placeholder="Enter your link"
                            invalid={Boolean(errors.portfolio)}
                            describedBy={errors.portfolio ? "portfolio-message" : undefined}
                        />
                    </div>
                    <FieldError id="portfolio-message">{errors.portfolio}</FieldError>
                </div>
            </div>
        </section>
    );
}
