"use client";

import chevronYear from "@/assets/Apply/icons/chevron-down-light-24.svg";
import { ApplyField, ApplySelect, ApplyTextInput, messageIdFor } from "@/components/Apply/ApplyFormControls";
import ChoiceField from "@/components/ExperienceEducation/ChoiceField";
import WorkHistory, { roleDates } from "@/components/ExperienceEducation/WorkHistory";
import {
    experienceLevels,
    graduationYears,
    noticePeriods,
    qualifications,
    shortenOptions,
    yesNo,
} from "@/components/ExperienceEducation/experienceOptions";

// Any level other than Fresher asks for work history, notice period and
// compensation (Figma 1878:19784, 1878:21065, 1878:20488, 1878:20133).
export const isExperienced = (level) => Boolean(level) && level !== "Fresher";

// The fresher's extra chip questions after Total Relevant Experience and
// Willing to Relocate (Figma 1878:20839).
const LEVEL_QUESTIONS = {
    Fresher: [
        {
            field: "largestProject",
            label: "Largest Project You have Worked On",
            options: ["Course Assignment", "Mini Project", "Final-year Project", "Internship Project", "Real Client Project"],
        },
        {
            field: "realWorldWork",
            label: "Real World Work",
            options: ["Internships", "Freelance or Volunteer Works", "Part-time Jobs", "Not Yet"],
            multiple: true,
            exclusive: "Not Yet",
        },
    ],
};

export const questionsFor = (level) => LEVEL_QUESTIONS[level] ?? [];

export const emptyExperienceEducation = {
    qualification: "",
    degree: "",
    fieldOfStudy: "",
    university: "",
    graduationYear: "",
    relevantExperience: "",
    relocate: "",
    largestProject: "",
    realWorldWork: [],
    // Experienced candidates: [{ jobTitle, organization, location, current,
    // startMonth, startYear, endMonth, endYear }].
    workHistory: [],
    servingNotice: "",
    noticePeriod: "",
    canShorten: "",
    // Lakhs per annum, as typed (e.g. "12.5").
    currentSalary: "",
    expectedSalary: "",
};

// Labels of the experienced candidates' fields, shared with the review stage.
export const experiencedLabels = {
    workHistory: "Work Experience",
    servingNotice: "Currently Serving Notice Period?",
    noticePeriod: "Notice Period",
    canShorten: "Can Your Notice Period be Shortened?",
    currentSalary: "Current Annual Salary",
    expectedSalary: "Expected Annual Salary",
};

export const formatLpa = (value) => (value ? `${value} LPA` : "");

const hasCurrentRole = (values) => (values.workHistory ?? []).some((role) => role.current === "Yes");

// Labels of the fixed fields, shared with the review stage.
export const experienceLabels = {
    qualification: "Qualification",
    degree: "Degree",
    fieldOfStudy: "Field of Study",
    university: "University or College",
    graduationYear: "Year of Graduation",
    relevantExperience: "Total Relevant Experience",
    relocate: "Willing to Relocate?",
};

const REQUIRED = {
    qualification: "Select your qualification.",
    degree: "Enter your degree.",
    fieldOfStudy: "Enter your field of study.",
    university: "Enter your university or college.",
    graduationYear: "Select your year of graduation.",
    relevantExperience: "Select your relevant experience.",
    relocate: "Select an option.",
};

const isEmpty = (value) => (Array.isArray(value) ? value.length === 0 : !String(value ?? "").trim());

// Returns { field: message } for every invalid field; the level's questions
// count only for the chosen level.
export function validateExperienceEducation(values) {
    const errors = {};
    for (const [field, message] of Object.entries(REQUIRED)) {
        if (isEmpty(values[field])) errors[field] = message;
    }
    for (const { field, multiple } of questionsFor(values.relevantExperience)) {
        if (isEmpty(values[field])) errors[field] = multiple ? "Select at least one option." : "Select an option.";
    }
    if (isExperienced(values.relevantExperience)) {
        if (isEmpty(values.workHistory)) errors.workHistory = "Add at least one role.";
        if (isEmpty(values.servingNotice)) errors.servingNotice = "Select an option.";
        if (values.servingNotice === "Yes") {
            if (isEmpty(values.noticePeriod)) errors.noticePeriod = "Select your notice period.";
            if (isEmpty(values.canShorten)) errors.canShorten = "Select an option.";
        }
        if (hasCurrentRole(values) && isEmpty(values.currentSalary)) {
            errors.currentSalary = "Enter your current annual salary.";
        }
        if (isEmpty(values.expectedSalary)) errors.expectedSalary = "Enter your expected annual salary.";
    }
    return errors;
}

// [{ field, label, value }] of every field the chosen level asks, for the
// review stage.
export function experienceSummary(values) {
    const rows = [
        ...Object.keys(experienceLabels).map((field) => ({ field, label: experienceLabels[field], value: values[field] })),
        ...questionsFor(values.relevantExperience).map(({ field, label }) => ({ field, label, value: values[field] })),
    ];
    if (!isExperienced(values.relevantExperience)) return rows;

    const shown = ["workHistory", "servingNotice", "noticePeriod", "currentSalary", "expectedSalary"];
    if (values.servingNotice === "Yes") shown.splice(3, 0, "canShorten");
    const display = {
        workHistory: (values.workHistory ?? []).map(
            (role) => `${role.jobTitle}, ${role.organization}, ${role.location} (${roleDates(role)})`,
        ),
        currentSalary: formatLpa(values.currentSalary),
        expectedSalary: formatLpa(values.expectedSalary),
    };
    return [
        ...rows,
        ...shown.map((field) => ({ field, label: experiencedLabels[field], value: display[field] ?? values[field] })),
    ];
}

function SectionHeading({ id, children }) {
    return (
        <h2 id={id} className="text-lg leading-[1.2] font-medium text-[#0b1c30]">
            {children}
        </h2>
    );
}

// Figma 1878:20839 (Fresher) and 1878:19784 etc. (experienced): stage 3 of
// the application. An Education card (qualification chips over two columns,
// then degree, field of study, university and year in four columns) and an
// Experience card whose questions after the first row depend on the level:
// a fresher gets the project / real-world-work chips; anyone else gets their
// work history, notice period questions and a Compensation card.
export default function ExperienceEducationForm({ values, errors, onChange }) {
    const setValue = (field, value) => onChange({ ...values, [field]: value }, field);

    const control = (field) => ({
        id: field,
        name: field,
        value: values[field] ?? "",
        invalid: Boolean(errors[field]),
        describedBy: messageIdFor(field, { error: errors[field] }),
    });
    const text = (field, placeholder) => (
        <ApplyField id={field} label={experienceLabels[field]} required error={errors[field]}>
            <ApplyTextInput {...control(field)} onChange={(event) => setValue(field, event.target.value)} placeholder={placeholder} />
        </ApplyField>
    );
    const choice = (field, options, className) => (
        <ChoiceField
            field={field}
            label={experienceLabels[field]}
            options={options}
            value={values[field]}
            error={errors[field]}
            onChange={(next) => setValue(field, next)}
            className={className}
        />
    );

    const levelQuestions = questionsFor(values.relevantExperience);
    const experienced = isExperienced(values.relevantExperience);
    const salary = (field, required) => (
        <ApplyField id={field} label={experiencedLabels[field]} required={required} error={errors[field]}>
            <ApplyTextInput
                {...control(field)}
                inputMode="decimal"
                placeholder="Enter CTC in LPA"
                // Lakhs per annum: digits with up to two decimals.
                onChange={(event) => {
                    const next = event.target.value.replace(/[^\d.]/g, "");
                    if (/^\d{0,4}(\.\d{0,2})?$/.test(next)) setValue(field, next);
                }}
            />
        </ApplyField>
    );

    return (
        <div className="flex w-full flex-col gap-8">
            <section aria-labelledby="education-title" className="flex flex-col gap-8">
                <SectionHeading id="education-title">Education</SectionHeading>
                <div className="grid w-full gap-x-8 gap-y-6 rounded-xl bg-white p-6 md:grid-cols-2 lg:grid-cols-4">
                    {choice("qualification", qualifications, "md:col-span-2")}
                    <div className="hidden lg:col-span-2 lg:block" />
                    {text("degree", "Ex: B.Tech")}
                    {text("fieldOfStudy", "Ex: Information Technology")}
                    {text("university", "Ex: Anna University")}
                    <ApplyField id="graduationYear" label={experienceLabels.graduationYear} required error={errors.graduationYear}>
                        <ApplySelect
                            {...control("graduationYear")}
                            onChange={(event) => setValue("graduationYear", event.target.value)}
                            options={graduationYears}
                            placeholder="Select the Year of Graduation"
                            icon={chevronYear}
                        />
                    </ApplyField>
                </div>
            </section>

            <section aria-labelledby="experience-title" className="flex flex-col gap-8">
                <SectionHeading id="experience-title">Experience</SectionHeading>
                <div className="grid w-full gap-x-8 gap-y-6 rounded-xl bg-white p-6 lg:grid-cols-3">
                    {choice("relevantExperience", experienceLevels, "lg:col-span-2")}
                    {choice("relocate", yesNo)}
                    {/* Keyed by level, so a new level's questions fade in. */}
                    <div
                        key={values.relevantExperience}
                        className="flex flex-col gap-6 motion-safe:animate-[apply-check-in_250ms_ease-out_both] empty:hidden lg:col-span-2"
                    >
                        {levelQuestions.map(({ field, label, options, multiple, exclusive }) => (
                            <ChoiceField
                                key={field}
                                field={field}
                                label={label}
                                options={options}
                                multiple={multiple}
                                exclusive={exclusive}
                                value={values[field]}
                                error={errors[field]}
                                onChange={(next) => setValue(field, next)}
                            />
                        ))}
                    </div>

                    {experienced && (
                        <div
                            key="experienced"
                            className="flex flex-col gap-8 motion-safe:animate-[apply-check-in_250ms_ease-out_both] lg:col-span-3"
                        >
                            <WorkHistory
                                value={values.workHistory}
                                error={errors.workHistory}
                                onChange={(next) => setValue("workHistory", next)}
                            />
                            <hr className="border-border-default" />
                            <div className="grid gap-x-8 gap-y-6 lg:grid-cols-3">
                                <ChoiceField
                                    field="servingNotice"
                                    label={experiencedLabels.servingNotice}
                                    options={yesNo}
                                    value={values.servingNotice}
                                    error={errors.servingNotice}
                                    onChange={(next) => setValue("servingNotice", next)}
                                />
                                <ChoiceField
                                    field="noticePeriod"
                                    // Optional unless they are serving notice now.
                                    label={values.servingNotice === "Yes" ? "Notice Period" : "If Notice Period Applicable"}
                                    required={values.servingNotice === "Yes"}
                                    options={noticePeriods}
                                    value={values.noticePeriod}
                                    error={errors.noticePeriod}
                                    onChange={(next) => setValue("noticePeriod", next)}
                                    className="lg:col-span-2"
                                />
                                {values.servingNotice === "Yes" && (
                                    <ChoiceField
                                        field="canShorten"
                                        label={experiencedLabels.canShorten}
                                        options={shortenOptions}
                                        value={values.canShorten}
                                        error={errors.canShorten}
                                        onChange={(next) => setValue("canShorten", next)}
                                        className="motion-safe:animate-[apply-check-in_200ms_ease-out_both]"
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {experienced && (
                // Figma 1878:20459: the section name in the first of three columns.
                <section
                    aria-labelledby="compensation-title"
                    className="grid w-full gap-x-8 gap-y-2 rounded-xl bg-white p-6 motion-safe:animate-[apply-check-in_250ms_ease-out_both] lg:grid-cols-3"
                >
                    <h2 id="compensation-title" className="text-lg leading-[1.2] font-medium text-[#0b1c30]">
                        Compensation
                    </h2>
                    {salary("currentSalary", hasCurrentRole(values))}
                    {salary("expectedSalary", true)}
                </section>
            )}
        </div>
    );
}
