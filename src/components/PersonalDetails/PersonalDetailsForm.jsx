import {
    ApplyField,
    ApplyPhoneInput,
    ApplySelect,
    ApplyTextInput,
    messageIdFor,
} from "@/components/Apply/ApplyFormControls";
import { countries, countryStates, genders } from "@/components/PersonalDetails/personalDetailsOptions";

export const emptyPersonalDetails = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    linkedIn: "",
    nationality: "",
    country: "",
    state: "",
    city: "",
    gender: "",
};

// Legal names: letters (any script), spaces, hyphens, apostrophes and dots.
// The footer asks candidates to avoid parentheses, slashes and the like.
const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Returns { field: message } for every invalid field; empty when valid.
export function validatePersonalDetails(values) {
    const errors = {};
    const requireValue = (field, message) => {
        if (!values[field].trim()) errors[field] = message;
    };

    requireValue("firstName", "Enter your first name.");
    requireValue("lastName", "Enter your last name.");
    requireValue("email", "Enter your email address.");
    requireValue("linkedIn", "Enter your LinkedIn profile URL.");
    requireValue("nationality", "Enter your nationality.");
    requireValue("country", "Select your country.");
    requireValue("state", "Select your state.");
    requireValue("city", "Enter your city.");
    requireValue("gender", "Select an option.");

    for (const field of ["firstName", "lastName"]) {
        if (!errors[field] && !NAME_PATTERN.test(values[field].trim())) {
            errors[field] = "Use letters only, without special characters.";
        }
    }
    if (!errors.email && !EMAIL_PATTERN.test(values.email.trim())) errors.email = "Enter a valid email address.";
    if (!errors.linkedIn && !/linkedin\.com\/?/i.test(values.linkedIn)) {
        errors.linkedIn = "Enter a LinkedIn profile URL.";
    }
    const digits = values.phone.replace(/\D/g, "");
    if (values.phone.trim() && digits.length !== 10) errors.phone = "Enter a 10-digit phone number.";

    return errors;
}

// Figma 1380:3211: stage 2 of the application. Three equal columns, 20
// apart, rows 16 apart (every field reserves its hint line, so rows are 97
// tall). Two columns on tablets, one on phones. Role is the job being applied
// for, so it is shown read-only and isn't part of the form values.
export default function PersonalDetailsForm({ values, errors, onChange, role }) {
    const set = (field) => (event) => {
        const next = { ...values, [field]: event.target.value };
        // A new country invalidates the chosen state.
        if (field === "country") next.state = "";
        onChange(next, field);
    };

    // Shared props of a field's control.
    const control = (field, hint) => ({
        id: field,
        name: field,
        value: values[field],
        onChange: set(field),
        invalid: Boolean(errors[field]),
        describedBy: messageIdFor(field, { hint, error: errors[field] }),
    });
    const text = (field, props, hint) => <ApplyTextInput {...control(field, hint)} {...props} />;
    const select = (field, props) => <ApplySelect {...control(field)} {...props} />;

    const NAME_HINT = "Names should match in both Aadhaar and UAN";

    const states = countryStates[values.country] ?? [];

    return (
        <section aria-labelledby="personal-details-title" className="w-full">
            <h2 id="personal-details-title" className="sr-only">
                Personal Details
            </h2>
            <div className="grid w-full gap-x-5 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
                <ApplyField
                    id="firstName"
                    label="First name"
                    required
                    hint={NAME_HINT}
                    error={errors.firstName}
                >
                    {text("firstName", { autoComplete: "given-name", placeholder: "Enter your first name" }, NAME_HINT)}
                </ApplyField>
                <ApplyField id="lastName" label="Last Name" required error={errors.lastName}>
                    {text("lastName", { autoComplete: "family-name", placeholder: "Enter your last name" })}
                </ApplyField>
                <ApplyField id="email" label="Email address" required error={errors.email}>
                    {text("email", { type: "email", autoComplete: "email", placeholder: "Enter your email address" })}
                </ApplyField>

                <ApplyField id="role" label="Role" required hint="Set by the job you are applying for">
                    {/* Read-only, drawn in Figma's grey field colour. */}
                    <div className="[&_input]:cursor-default [&_input]:bg-[#f9fafb] [&_input]:focus:border-border-default">
                        <ApplyTextInput
                            id="role"
                            name="role"
                            value={role}
                            readOnly
                            aria-readonly="true"
                            describedBy="role-message"
                        />
                    </div>
                </ApplyField>
                <ApplyField id="phone" label="Phone Number" error={errors.phone}>
                    <ApplyPhoneInput {...control("phone")} autoComplete="tel-national" placeholder="9876543210" />
                </ApplyField>
                <ApplyField id="linkedIn" label="LinkedIn Profile URL" required error={errors.linkedIn}>
                    {text("linkedIn", { type: "url", autoComplete: "url", placeholder: "linkedin.com/in/your-name" })}
                </ApplyField>

                <ApplyField id="nationality" label="Nationality" required error={errors.nationality}>
                    {text("nationality", { placeholder: "Enter your Nationality" })}
                </ApplyField>
                <ApplyField id="country" label="Country" required error={errors.country}>
                    {select("country", {
                        autoComplete: "country-name",
                        placeholder: "Select Your Country",
                        options: countries,
                    })}
                </ApplyField>
                <ApplyField id="state" label="State" required error={errors.state}>
                    {select("state", {
                        autoComplete: "address-level1",
                        placeholder: values.country ? "Select Your State" : "Select a country first",
                        options: states,
                        disabled: !values.country,
                    })}
                </ApplyField>

                <ApplyField id="city" label="City" required error={errors.city}>
                    {text("city", { autoComplete: "address-level2", placeholder: "Enter Your City" })}
                </ApplyField>
                <ApplyField id="gender" label="Gender" required error={errors.gender}>
                    {select("gender", { placeholder: "Select one option", options: genders })}
                </ApplyField>
            </div>
        </section>
    );
}
