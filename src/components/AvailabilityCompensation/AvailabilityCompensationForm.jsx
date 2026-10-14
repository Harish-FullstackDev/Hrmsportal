import { ApplyTagPicker } from "@/components/Apply/ApplyCombobox";
import { ApplyField, ApplySelect, ApplyTextInput, messageIdFor } from "@/components/Apply/ApplyFormControls";

// Options for the dropdowns. The design shows none, so these are starting
// points; salaries are annual INR bands (the role is in Kochi).
const noticePeriods = ["Immediate", "15 days", "30 days", "45 days", "60 days", "90 days", "More than 90 days"];
const yesNo = ["Yes", "No", "Open to discuss"];
const availableFrom = [
    "Immediately",
    "Within 2 weeks",
    "Within 1 month",
    "Within 2 months",
    "Within 3 months",
    "After 3 months",
];
const salaryBands = [
    "Below ₹5 LPA",
    "₹5–10 LPA",
    "₹10–15 LPA",
    "₹15–20 LPA",
    "₹20–30 LPA",
    "₹30–40 LPA",
    "₹40–50 LPA",
    "Above ₹50 LPA",
];
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

const REQUIRED = {
    noticePeriod: "Select your notice period.",
    canShorten: "Select an option.",
    lastWorkingDay: "Enter your last working day.",
    availableFrom: "Select when you are available.",
    relocate: "Select an option.",
    currentSalary: "Select your current or last salary.",
    expectedSalary: "Select your expected salary.",
};

const today = () => new Date().toISOString().slice(0, 10);

// Returns { field: message } for every invalid field; empty when valid.
export function validateAvailabilityCompensation(values) {
    const errors = {};
    for (const [field, message] of Object.entries(REQUIRED)) {
        if (!values[field]) errors[field] = message;
    }
    if (values.earliestStart && values.earliestStart < today()) {
        errors.earliestStart = "Choose today or a later date.";
    }
    return errors;
}

// Figma 1380:3781: stage 5 of the application. Same 3-column grid as the
// other stages (20 apart, rows 16 apart); two columns on tablets, one on
// phones. Dates use the browser's date picker.
export default function AvailabilityCompensationForm({ values, errors, onChange }) {
    const setValue = (field, value) => onChange({ ...values, [field]: value }, field);

    const control = (field) => ({
        id: field,
        name: field,
        value: values[field],
        invalid: Boolean(errors[field]),
        describedBy: messageIdFor(field, { error: errors[field] }),
    });
    const select = (field, options, placeholder = "Select one Option") => (
        <ApplySelect
            {...control(field)}
            onChange={(event) => setValue(field, event.target.value)}
            options={options}
            placeholder={placeholder}
        />
    );
    const date = (field, props) => (
        <ApplyTextInput {...control(field)} type="date" onChange={(event) => setValue(field, event.target.value)} {...props} />
    );

    return (
        <section aria-labelledby="availability-title" className="w-full">
            <h2 id="availability-title" className="sr-only">
                Availability and Compensation
            </h2>
            <div className="grid w-full gap-x-5 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
                <ApplyField id="noticePeriod" label="Notice period" required error={errors.noticePeriod}>
                    {select("noticePeriod", noticePeriods)}
                </ApplyField>
                <ApplyField id="canShorten" label="Can your notice period be shortened?" required error={errors.canShorten}>
                    {select("canShorten", yesNo)}
                </ApplyField>
                <ApplyField id="earliestStart" label="Earliest start date" error={errors.earliestStart}>
                    {date("earliestStart", { min: today() })}
                </ApplyField>

                <ApplyField id="lastWorkingDay" label="Last working day" required error={errors.lastWorkingDay}>
                    {date("lastWorkingDay")}
                </ApplyField>
                <ApplyField id="availableFrom" label="Available from" required error={errors.availableFrom}>
                    {select("availableFrom", availableFrom)}
                </ApplyField>
                <ApplyField id="relocate" label="Willing to relocate to the job location" required error={errors.relocate}>
                    {select("relocate", yesNo)}
                </ApplyField>

                <ApplyField id="languages" label="Languages" error={errors.languages}>
                    <ApplyTagPicker
                        id="languages"
                        value={values.languages}
                        onChange={(next) => setValue("languages", next)}
                        options={languageOptions}
                        placeholder="Add the languages you speak"
                        listLabel="Languages"
                        chevron={false}
                        widthClassName=""
                    />
                </ApplyField>
                <ApplyField
                    id="currentSalary"
                    label="Current or last drawn annual fixed salary"
                    required
                    error={errors.currentSalary}
                >
                    {select("currentSalary", salaryBands, "Select your salary")}
                </ApplyField>
                <ApplyField id="expectedSalary" label="Expected annual salary" required error={errors.expectedSalary}>
                    {select("expectedSalary", salaryBands, "Expected Annual Salary")}
                </ApplyField>
            </div>
        </section>
    );
}
