import Image from "next/image";

import checkboxChecked from "@/assets/Apply/icons/checkbox-checked-16.svg";
import { ApplyField, ApplySelect, ApplyTextInput, messageIdFor } from "@/components/Apply/ApplyFormControls";

// Questions answered on the review stage itself, plus the declaration
// (Figma 1435:14827 and 1435:14918). Stored under the "review-and-submit"
// stage like any other stage's answers.

const yesNo = ["Yes", "No"];
const heardFromOptions = ["LinkedIn", "Company website", "Job portal", "Referral", "Social media", "Campus / university", "Other"];

export const emptyReviewExtras = {
    previousConnection: "",
    heardFrom: "",
    referralName: "",
    referralCode: "",
    declarationAccepted: false,
    keepProfile: false,
};

// Returns { field: message } for every invalid field; empty when valid.
export function validateReviewExtras(values) {
    const errors = {};
    if (!values.previousConnection) errors.previousConnection = "Select an option.";
    if (!values.heardFrom) errors.heardFrom = "Select an option.";
    if (!values.declarationAccepted) errors.declarationAccepted = "Please confirm the declaration to submit.";
    return errors;
}

// Figma 1435:14827: editable card in the review's card style, 3 columns.
// (Figma's second row also repeats "Available from" and "Willing to relocate",
// but as hidden layers, so they are left out.)
export function AdditionalInformation({ values, errors, onChange }) {
    const setValue = (field, value) => onChange({ ...values, [field]: value }, field);
    const control = (field) => ({
        id: field,
        name: field,
        value: values[field],
        invalid: Boolean(errors[field]),
        describedBy: messageIdFor(field, { error: errors[field] }),
        onChange: (event) => setValue(field, event.target.value),
    });

    return (
        <section aria-label="Additional information" className="w-full">
            <div className="grid w-full gap-x-5 gap-y-4 rounded-xl bg-white px-4 pt-[38px] pb-[34px] shadow-[0px_4px_38.3px_0px_rgba(0,0,0,0.21)] sm:px-[23px] md:grid-cols-2 lg:grid-cols-3">
                <ApplyField
                    id="previousConnection"
                    label="Previous connection with SST or Ascendus"
                    required
                    error={errors.previousConnection}
                >
                    <ApplySelect {...control("previousConnection")} options={yesNo} placeholder="Select one Option" />
                </ApplyField>
                <ApplyField id="heardFrom" label="How did you hear about us" required error={errors.heardFrom}>
                    <ApplySelect {...control("heardFrom")} options={heardFromOptions} placeholder="Select one Option" />
                </ApplyField>
                <ApplyField id="referralName" label="Referral Name" error={errors.referralName}>
                    <ApplyTextInput {...control("referralName")} autoComplete="off" placeholder="Enter Referral Name" />
                </ApplyField>
                <ApplyField id="referralCode" label="Referral Code" error={errors.referralCode}>
                    <ApplyTextInput {...control("referralCode")} autoComplete="off" placeholder="Referral Code" />
                </ApplyField>
            </div>
        </section>
    );
}

// Figma checkbox: 16px white box, #d4d4d4 border, 4 radius; ticked it uses
// the blue checkbox from the skills check.
function DeclarationCheckbox({ id, checked, onChange, invalid, describedBy, children }) {
    return (
        <label htmlFor={id} className="flex cursor-pointer items-start gap-2 text-sm leading-[1.4] text-neutral-700">
            <input
                suppressHydrationWarning
                id={id}
                type="checkbox"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
                aria-invalid={invalid || undefined}
                aria-describedby={describedBy}
                className="peer sr-only"
            />
            <span className="mt-[2px] grid size-4 shrink-0 place-items-center rounded peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-action">
                {checked ? (
                    <Image src={checkboxChecked} alt="" width={16} height={16} />
                ) : (
                    <span className={`size-4 rounded border bg-white ${invalid ? "border-required" : "border-neutral-300"}`} />
                )}
            </span>
            <span>{children}</span>
        </label>
    );
}

// Figma 1435:14918: blue 16px "Declaration" title, 24 above the checkboxes
// (32 apart). The first is required to submit.
export function Declaration({ values, errors, onChange }) {
    const setValue = (field, value) => onChange({ ...values, [field]: value }, field);

    return (
        <section aria-labelledby="declaration-title" className="flex w-full flex-col gap-6">
            <h2 id="declaration-title" className="text-base leading-[1.5] text-action">
                Declaration
            </h2>
            <div className="flex w-full max-w-[680px] flex-col gap-8">
                <div className="flex flex-col gap-1">
                    <DeclarationCheckbox
                        id="declarationAccepted"
                        checked={values.declarationAccepted}
                        onChange={(checked) => setValue("declarationAccepted", checked)}
                        invalid={Boolean(errors.declarationAccepted)}
                        describedBy={errors.declarationAccepted ? "declarationAccepted-message" : undefined}
                    >
                        <span className="mb-1 block">
                            I confirm that the information I have provided is accurate and complete to the best of my
                            knowledge.
                        </span>
                        <span className="block">
                            I understand that incorrect or misleading information may affect my application or any offer
                            made to me.
                        </span>
                    </DeclarationCheckbox>
                    {errors.declarationAccepted && (
                        <p id="declarationAccepted-message" className="pl-6 text-xs leading-[1.4] text-required">
                            {errors.declarationAccepted}
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <DeclarationCheckbox
                        id="keepProfile"
                        checked={values.keepProfile}
                        onChange={(checked) => setValue("keepProfile", checked)}
                        describedBy="keepProfile-hint"
                    >
                        Keep my profile for future roles
                    </DeclarationCheckbox>
                    <p id="keepProfile-hint" className="text-xs leading-[1.4] font-light text-muted-ink italic">
                        Keep my profile for future opportunities
                    </p>
                </div>
            </div>
        </section>
    );
}
