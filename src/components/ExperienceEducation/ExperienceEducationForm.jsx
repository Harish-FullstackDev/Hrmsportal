import { ApplyCombobox, ApplyTagPicker } from "@/components/Apply/ApplyCombobox";
import { ApplyField, ApplySelect, ApplyTextInput, messageIdFor } from "@/components/Apply/ApplyFormControls";
import { experienceFieldsFor, statusOptions } from "@/components/Apply/applicantStatus";
import {
    experienceRanges,
    graduationYears,
    qualifications,
    skills,
    universities,
} from "@/components/ExperienceEducation/experienceOptions";

export const MAX_SKILLS = 6;

export const emptyExperienceEducation = {
    employmentStatus: "",
    totalExperience: "",
    relevantExperience: "",
    employer: "",
    jobTitle: "",
    qualification: "",
    fieldOfStudy: "",
    university: "",
    graduationYear: "",
    internships: "",
    skills: [],
};

// Message for each field when it is shown and left empty.
const REQUIRED = {
    employmentStatus: "Select your current status.",
    totalExperience: "Select your total years of experience.",
    relevantExperience: "Select your relevant experience.",
    employer: "Enter your current or most recent employer.",
    jobTitle: "Enter your current or most recent job title.",
    qualification: "Select your highest qualification.",
    fieldOfStudy: "Enter your field of study.",
    university: "Enter your university or college.",
    graduationYear: "Select your year of graduation.",
    internships: "Enter your internships or academic projects.",
    skills: "Add at least one skill.",
};

// Labels, shared with the review stage.
export const experienceLabels = {
    employmentStatus: "Current Status",
    totalExperience: "Total years of experience",
    relevantExperience: "Relevant experience for this role",
    employer: "Current or most recent employer",
    jobTitle: "Current or most recent job title",
    qualification: "Highest qualification",
    fieldOfStudy: "Field of study",
    university: "University or college",
    graduationYear: "Year of graduation",
    internships: "Internships or academic projects",
    skills: "What kind of work have you done most?",
};

// Returns { field: message } for every invalid field the current status
// shows; fields hidden for that status are ignored.
export function validateExperienceEducation(values) {
    const errors = {};
    for (const field of experienceFieldsFor(values.employmentStatus)) {
        const value = values[field];
        const empty = Array.isArray(value) ? value.length === 0 : !String(value ?? "").trim();
        if (empty) errors[field] = REQUIRED[field];
    }
    return errors;
}

// Fields that open when the status changes fade in.
const FADE_IN = "motion-safe:animate-[apply-fade-in_300ms_ease-out_both]";

// Figma 1380:3376 + the status variants (see applicantStatus.js): stage 3 of
// the application. "Current Status" comes first and decides the rest. Same
// 3-column grid as stage 2 (20 apart, rows 16 apart); the skills picker sits
// on its own row with its label 8 above the field. Two columns on tablets,
// one on phones.
export default function ExperienceEducationForm({ values, errors, onChange }) {
    const setValue = (field, value) => onChange({ ...values, [field]: value }, field);
    const fields = experienceFieldsFor(values.employmentStatus);
    const gridFields = fields.filter((field) => field !== "skills");

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

    const controls = {
        employmentStatus: () => select("employmentStatus", statusOptions),
        totalExperience: () => select("totalExperience", experienceRanges),
        relevantExperience: () => select("relevantExperience", experienceRanges),
        employer: () => text("employer", "Enter your employer's name"),
        jobTitle: () => text("jobTitle", "Enter your job title"),
        qualification: () => select("qualification", qualifications),
        fieldOfStudy: () => text("fieldOfStudy", "Enter Field of study"),
        university: () => (
            <ApplyCombobox
                {...control("university")}
                onChange={(value) => setValue("university", value)}
                options={universities}
                placeholder="Enter Your University Name"
            />
        ),
        graduationYear: () => select("graduationYear", graduationYears, "Select year"),
        internships: () => text("internships", "Enter your internships or projects"),
    };

    return (
        <section aria-labelledby="experience-education-title" className="flex w-full flex-col gap-4">
            <h2 id="experience-education-title" className="sr-only">
                Experience and Education
            </h2>
            <div className="grid w-full gap-x-5 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
                {gridFields.map((field) => (
                    <ApplyField
                        key={field}
                        id={field}
                        label={experienceLabels[field]}
                        required
                        error={errors[field]}
                        className={field === "employmentStatus" ? "" : FADE_IN}
                    >
                        {controls[field]()}
                    </ApplyField>
                ))}
            </div>

            {fields.includes("skills") && (
                <div className={`flex flex-col gap-2 ${FADE_IN}`}>
                    <label htmlFor="skills" className="text-lg leading-[1.2] font-medium text-[#374151]">
                        {experienceLabels.skills}
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
            )}
        </section>
    );
}
