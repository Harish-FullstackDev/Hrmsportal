import { ApplyField, ApplySelect, ApplyTextInput, messageIdFor } from "@/components/Apply/ApplyFormControls";
import { experienceFieldsFor, statusOptions } from "@/components/Apply/applicantStatus";
import {
    experienceRanges,
    graduationYears,
    qualifications,
    universities,
} from "@/components/ExperienceEducation/experienceOptions";

export const OTHER_UNIVERSITY = "Other";

// What the review shows: the typed name when University is "Other".
export const universityName = (values) =>
    values.university === OTHER_UNIVERSITY ? values.universityOther ?? "" : values.university;

export const emptyExperienceEducation = {
    employmentStatus: "",
    totalExperience: "",
    relevantExperience: "",
    employer: "",
    jobTitle: "",
    qualification: "",
    fieldOfStudy: "",
    university: "",
    // The name typed in when University is "Other".
    universityOther: "",
    graduationYear: "",
    internships: "",
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
    universityOther: "Enter your university or college name.",
    graduationYear: "Select your year of graduation.",
    internships: "Enter your internships or academic projects.",
};

// Labels, shared with the review stage.
export const experienceLabels = {
    employmentStatus: "Current status",
    totalExperience: "Total years of experience",
    relevantExperience: "Relevant experience for this role",
    employer: "Current or most recent employer",
    jobTitle: "Current or most recent job title",
    qualification: "Highest qualification",
    fieldOfStudy: "Field of study",
    university: "University or college",
    universityOther: "University or college name",
    graduationYear: "Year of graduation",
    internships: "Internships or academic projects",
};

// Returns { field: message } for every invalid field the current status
// shows; fields hidden for that status are ignored.
export function validateExperienceEducation(values) {
    const errors = {};
    for (const field of experienceFieldsFor(values.employmentStatus)) {
        const value = values[field];
        const empty = Array.isArray(value) ? value.length === 0 : !String(value ?? "").trim();
        if (empty) errors[field] = REQUIRED[field];
        // University must come from the list (answers saved when it was a
        // free-text field may not); "Other" needs its name field.
        else if (field === "university" && value === OTHER_UNIVERSITY) {
            if (!values.universityOther?.trim()) errors.universityOther = REQUIRED.universityOther;
        } else if (field === "university" && !universities.includes(value)) {
            errors.university = 'Pick a university from the list, or choose "Other".';
        }
    }
    return errors;
}

// Fields that open when the status changes fade in.
const FADE_IN = "motion-safe:animate-[apply-fade-in_300ms_ease-out_both]";

// "Current status" as a row of toggle buttons; the chosen one is filled blue.
// The first button carries the field id so a validation error can focus it.
function StatusPicker({ value, error, onChange }) {
    return (
        <div className="flex flex-col">
            <p id="employmentStatus-label" className="text-lg leading-[1.2] font-medium text-[#374151]">
                {experienceLabels.employmentStatus}
                <span className="text-[#ef4444]">*</span>
            </p>
            <div
                role="radiogroup"
                aria-labelledby="employmentStatus-label"
                aria-describedby={error ? "employmentStatus-message" : undefined}
                aria-invalid={error ? true : undefined}
                className="mt-3 flex flex-wrap gap-2"
            >
                {statusOptions.map((option, index) => {
                    const selected = value === option;
                    return (
                        <button
                            key={option}
                            id={index === 0 ? "employmentStatus" : undefined}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => onChange(option)}
                            className={`h-9 rounded-md border px-4 text-sm leading-5 transition-colors ${
                                selected
                                    ? "border-action bg-action text-white"
                                    : `bg-white text-ink hover:border-action ${error ? "border-required" : "border-border-default"}`
                            }`}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
            <p id="employmentStatus-message" className="mt-1 min-h-[17px] text-xs leading-[1.4] text-required">
                {error}
            </p>
        </div>
    );
}

// Figma 1380:3376 + the status variants (see applicantStatus.js): stage 3 of
// the application. "Current Status" comes first and decides the rest. Same
// 3-column grid as stage 2 (20 apart, rows 16 apart). Two columns on tablets,
// one on phones.
export default function ExperienceEducationForm({ values, errors, onChange }) {
    const setValue = (field, value) => onChange({ ...values, [field]: value }, field);
    const fields = experienceFieldsFor(values.employmentStatus);
    // "Other" opens a name field right after University.
    // Status sits above the grid as its own row of buttons.
    const gridFields = fields
        .filter((field) => field !== "employmentStatus")
        .flatMap((field) =>
            field === "university" && values.university === OTHER_UNIVERSITY ? [field, "universityOther"] : [field],
        );

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
        totalExperience: () => select("totalExperience", experienceRanges),
        relevantExperience: () => select("relevantExperience", experienceRanges),
        employer: () => text("employer", "Enter your employer's name"),
        jobTitle: () => text("jobTitle", "Enter your job title"),
        qualification: () => select("qualification", qualifications),
        fieldOfStudy: () => text("fieldOfStudy", "Enter Field of study"),
        // A pick-only list; "Other" (last) opens the name field.
        university: () =>
            select("university", [...universities, OTHER_UNIVERSITY], "Select your university or college"),
        universityOther: () => text("universityOther", "Enter your university or college name"),
        graduationYear: () => select("graduationYear", graduationYears, "Select year"),
        internships: () => text("internships", "Enter your internships or projects"),
    };

    return (
        <section aria-labelledby="experience-education-title" className="flex w-full flex-col gap-4">
            <h2 id="experience-education-title" className="sr-only">
                Experience and Education
            </h2>
            <StatusPicker
                value={values.employmentStatus}
                error={errors.employmentStatus}
                onChange={(next) => setValue("employmentStatus", next)}
            />
            <div className="grid w-full gap-x-5 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
                {gridFields.map((field) => (
                    <ApplyField
                        key={field}
                        id={field}
                        label={experienceLabels[field]}
                        required
                        error={errors[field]}
                        className={FADE_IN}
                    >
                        {controls[field]()}
                    </ApplyField>
                ))}
            </div>
        </section>
    );
}
