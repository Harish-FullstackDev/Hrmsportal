import { ApplyTagPicker } from "@/components/Apply/ApplyCombobox";
import { ApplyField, ApplySelect, ApplyTextInput, messageIdFor } from "@/components/Apply/ApplyFormControls";
import { availabilityFieldsFor } from "@/components/Apply/applicantStatus";

// Options for the dropdowns. The design shows none, so these are starting
// points.
const noticePeriods = ["Immediate", "15 days", "30 days", "45 days", "60 days", "90 days", "More than 90 days"];
const yesNo = ["Yes", "No", "Open to discuss"];
const languageOptions = ["English", "Malayalam", "Hindi", "Tamil", "Kannada", "Telugu", "Arabic", "French", "German"];

export const emptyAvailabilityCompensation = {
    noticePeriod: "",
    canShorten: "",
    earliestStart: "",
    lastWorkingDay: "",
    availableFrom: "",
    relocate: "",
    languages: [],
    currentSalary: "",
    expectedSalary: "",
};

// Labels, shared with the review stage.
export const availabilityLabels = {
    noticePeriod: "Notice period",
    canShorten: "Can your notice period be shortened?",
    earliestStart: "Earliest start date",
    lastWorkingDay: "Last working day",
    availableFrom: "Available from",
    relocate: "Willing to relocate to the job location",
    languages: "Languages",
    currentSalary: "Current annual salary",
    expectedSalary: "Expected annual salary",
};

// Optional fields; every other shown field is required.
const OPTIONAL = new Set(["earliestStart", "languages"]);

const REQUIRED = {
    noticePeriod: "Select your notice period.",
    canShorten: "Select an option.",
    lastWorkingDay: "Enter your last working day.",
    availableFrom: "Enter the date you are available from.",
    relocate: "Select an option.",
    currentSalary: "Enter your current annual salary.",
    expectedSalary: "Enter your expected annual salary.",
};

const today = () => new Date().toISOString().slice(0, 10);

// Salaries are stored as digits and shown with Indian digit grouping.
export const formatSalary = (digits) => (digits ? `₹${Number(digits).toLocaleString("en-IN")}` : "");

// Returns { field: message } for every invalid field the status shows.
export function validateAvailabilityCompensation(values, status) {
    const errors = {};
    const fields = availabilityFieldsFor(status);
    for (const field of fields) {
        if (!OPTIONAL.has(field) && !values[field]) errors[field] = REQUIRED[field];
    }
    for (const field of ["earliestStart", "availableFrom"]) {
        if (fields.includes(field) && !errors[field] && values[field] && values[field] < today()) {
            errors[field] = "Choose today or a later date.";
        }
    }
    return errors;
}

// Figma 1380:3781 + the status variants (see applicantStatus.js): stage 5 of
// the application. The fields depend on the status chosen in stage 3. Same
// 3-column grid as the other stages; dates use the browser's date picker and
// salaries are typed amounts.
export default function AvailabilityCompensationForm({ values, errors, onChange, status }) {
    const setValue = (field, value) => onChange({ ...values, [field]: value }, field);
    const fields = availabilityFieldsFor(status);

    const control = (field) => ({
        id: field,
        name: field,
        value: values[field],
        invalid: Boolean(errors[field]),
        describedBy: messageIdFor(field, { error: errors[field] }),
    });
    const select = (field, options) => (
        <ApplySelect
            {...control(field)}
            onChange={(event) => setValue(field, event.target.value)}
            options={options}
            placeholder="Select one Option"
        />
    );
    const date = (field, props) => (
        <ApplyTextInput {...control(field)} type="date" onChange={(event) => setValue(field, event.target.value)} {...props} />
    );
    const salary = (field, placeholder) => (
        <ApplyTextInput
            {...control(field)}
            value={values[field] ? Number(values[field]).toLocaleString("en-IN") : ""}
            inputMode="numeric"
            placeholder={placeholder}
            onChange={(event) => setValue(field, event.target.value.replace(/\D/g, "").slice(0, 12))}
        />
    );

    const controls = {
        noticePeriod: () => select("noticePeriod", noticePeriods),
        canShorten: () => select("canShorten", yesNo),
        earliestStart: () => date("earliestStart", { min: today() }),
        lastWorkingDay: () => date("lastWorkingDay"),
        availableFrom: () => date("availableFrom", { min: today() }),
        relocate: () => select("relocate", yesNo),
        languages: () => (
            <ApplyTagPicker
                id="languages"
                value={values.languages}
                onChange={(next) => setValue("languages", next)}
                options={languageOptions}
                placeholder="Enter the languages you know"
                listLabel="Languages"
                tagsAbove
                chevron={false}
                widthClassName=""
            />
        ),
        currentSalary: () => salary("currentSalary", "Enter your annual fixed salary"),
        expectedSalary: () => salary("expectedSalary", "Enter your expected annual salary"),
    };

    return (
        <section aria-labelledby="availability-title" className="w-full">
            <h2 id="availability-title" className="sr-only">
                Availability and Compensation
            </h2>
            <div className="grid w-full gap-x-5 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
                {fields.map((field) => (
                    <ApplyField
                        key={field}
                        id={field}
                        label={availabilityLabels[field]}
                        required={!OPTIONAL.has(field)}
                        error={errors[field]}
                    >
                        {controls[field]()}
                    </ApplyField>
                ))}
            </div>
        </section>
    );
}
