import { ApplyCombobox, ApplyTagPicker } from "@/components/Apply/ApplyCombobox";
import { ApplyField, ApplySelect, ApplyTextInput, messageIdFor } from "@/components/Apply/ApplyFormControls";
import {
    employmentStatuses,
    experienceRanges,
    graduationYears,
    qualifications,
    skills,
    universities,
} from "@/components/ExperienceEducation/experienceOptions";

export const MAX_SKILLS = 6;

export const emptyExperienceEducation = {
    totalExperience: "",
    relevantExperience: "",
    employer: "",
    jobTitle: "",
    employmentStatus: "",
    qualification: "",
    fieldOfStudy: "",
    university: "",
    graduationYear: "",
    skills: [],
};

const REQUIRED = {
    totalExperience: "Select your total years of experience.",
    relevantExperience: "Select your relevant experience.",
    employer: "Enter your current or most recent employer.",
    jobTitle: "Enter your current or most recent job title.",
    employmentStatus: "Select your current employment status.",
    qualification: "Select your highest qualification.",
    fieldOfStudy: "Enter your field of study.",
    university: "Enter your university or college.",
    graduationYear: "Select your year of graduation.",
};

// Returns { field: message } for every invalid field; empty when valid.
export function validateExperienceEducation(values) {
    const errors = {};
    for (const [field, message] of Object.entries(REQUIRED)) {
        if (!values[field].trim()) errors[field] = message;
    }
    if (values.skills.length === 0) errors.skills = "Add at least one skill.";
    return errors;
}

// Figma 1380:3376: stage 3 of the application. Same 3-column grid as stage 2
// (20 apart, rows 16 apart), then the skills picker on its own row with its
// label 8 above the field. Two columns on tablets, one on phones.
export default function ExperienceEducationForm({ values, errors, onChange }) {
    const setValue = (field, value) => onChange({ ...values, [field]: value }, field);

    const control = (field) => ({
        id: field,
        name: field,
        value: values[field],
        invalid: Boolean(errors[field]),
        describedBy: messageIdFor(field, { error: errors[field] }),
    });
    const text = (field, placeholder) => (
        <ApplyTextInput
            {...control(field)}
            onChange={(event) => setValue(field, event.target.value)}
            placeholder={placeholder}
        />
    );
    const select = (field, options, placeholder = "Select one Option") => (
        <ApplySelect
            {...control(field)}
            onChange={(event) => setValue(field, event.target.value)}
            options={options}
            placeholder={placeholder}
        />
    );

    return (
        <section aria-labelledby="experience-education-title" className="flex w-full flex-col gap-4">
            <h2 id="experience-education-title" className="sr-only">
                Experience and Education
            </h2>
            <div className="grid w-full gap-x-5 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
                <ApplyField id="totalExperience" label="Total years of experience" required error={errors.totalExperience}>
                    {select("totalExperience", experienceRanges)}
                </ApplyField>
                <ApplyField
                    id="relevantExperience"
                    label="Relevant experience for this role"
                    required
                    error={errors.relevantExperience}
                >
                    {select("relevantExperience", experienceRanges)}
                </ApplyField>
                <ApplyField id="employer" label="Current or most recent employer" required error={errors.employer}>
                    {text("employer", "Enter your employer's name")}
                </ApplyField>

                <ApplyField id="jobTitle" label="Current or most recent job title" required error={errors.jobTitle}>
                    {text("jobTitle", "Enter your job title")}
                </ApplyField>
                <ApplyField
                    id="employmentStatus"
                    label="Current employment status"
                    required
                    error={errors.employmentStatus}
                >
                    {select("employmentStatus", employmentStatuses)}
                </ApplyField>
                <ApplyField id="qualification" label="Highest qualification" required error={errors.qualification}>
                    {select("qualification", qualifications)}
                </ApplyField>

                <ApplyField id="fieldOfStudy" label="Field of study" required error={errors.fieldOfStudy}>
                    {text("fieldOfStudy", "Enter Field of study")}
                </ApplyField>
                <ApplyField id="university" label="University or college" required error={errors.university}>
                    <ApplyCombobox
                        {...control("university")}
                        onChange={(value) => setValue("university", value)}
                        options={universities}
                        placeholder="Enter Your University Name"
                    />
                </ApplyField>
                <ApplyField id="graduationYear" label="Year of graduation" required error={errors.graduationYear}>
                    {select("graduationYear", graduationYears, "Select year")}
                </ApplyField>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="skills" className="text-lg leading-[1.2] font-medium text-[#374151]">
                    What kind of work have you done most?
                    <span className="text-[#ef4444]">*</span>
                </label>
                <ApplyTagPicker
                    id="skills"
                    value={values.skills}
                    onChange={(next) => setValue("skills", next)}
                    options={skills}
                    max={MAX_SKILLS}
                    placeholder="Search or add a skill"
                    fullPlaceholder="Maximum skills reached"
                    limitMessage={`Maximum ${MAX_SKILLS} skills allowed`}
                    listLabel="Selected skills"
                    invalid={Boolean(errors.skills)}
                    describedBy={errors.skills ? "skills-message" : undefined}
                />
                {errors.skills && (
                    <p id="skills-message" className="text-xs leading-[1.4] text-required">
                        {errors.skills}
                    </p>
                )}
            </div>
        </section>
    );
}
