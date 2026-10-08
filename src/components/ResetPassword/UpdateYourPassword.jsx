"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Button from "@/components/CommonComponents/Button";
import LogoMark from "@/components/CommonComponents/LogoMark";
import PasswordInput from "@/components/CommonComponents/PasswordInput";

import iconRequirementMet from "@/assets/ResetPassword/icons/requirement-met-16.svg";
import iconRequirementUnmet from "@/assets/ResetPassword/icons/requirement-unmet-16.svg";
import iconEye from "@/assets/CommonComponents/icons/eye-20.svg";
import iconEyeSlash from "@/assets/CommonComponents/icons/eye-slash-20.svg";
import iconError from "@/assets/CommonComponents/icons/error-16.svg";

const REQUIREMENTS = [
    { label: "8 characters", test: (p) => p.length >= 8 },
    { label: "Uppercase letter (A-Z)", test: (p) => /[A-Z]/.test(p) },
    { label: "Number (0-9)", test: (p) => /\d/.test(p) },
    { label: "Lowercase letter (a-z)", test: (p) => /[a-z]/.test(p) },
];

const fieldClass = "rounded-[10px] border pr-[11px] pl-[18px]";

// Figma "Enter new password": new password with live rule checks, plus a
// matching confirmation field.
export default function UpdateYourPassword() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");

    const results = REQUIREMENTS.map((r) => ({ ...r, met: r.test(password) }));
    const allMet = results.every((r) => r.met);
    const mismatch = confirmation.length > 0 && confirmation !== password;
    const canSubmit = allMet && confirmation === password;

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!canSubmit) return;
        // TODO: update the password with Supabase before showing success.
        router.push("/reset-password/success");
    };

    return (
        <>
            <LogoMark />

            <div className="flex flex-col gap-4 pt-[26px] text-center">
                <h1 className="text-[32px] leading-[42px] font-bold text-ink">Update your password</h1>
                <p className="text-lg leading-[27px] text-[#202322]">
                    Set your new password with minimum 8 characters with a combination of letters and
                    numbers
                </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="pt-8">
                <div className="flex flex-col gap-3">
                    <label htmlFor="new-password" className="text-sm leading-5 text-ink-strong">
                        New Password<span className="text-danger-strong">*</span>
                    </label>
                    <PasswordInput
                        id="new-password"
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        aria-describedby="password-requirements"
                        fieldClassName={`${fieldClass} h-[52px] border-field-soft`}
                        className="text-[19px] text-ink-strong"
                        hiddenIcon={iconEye}
                        visibleIcon={iconEyeSlash}
                    />
                </div>

                <ul id="password-requirements" className="grid grid-flow-col grid-rows-2 gap-x-1 gap-y-1.5 pt-5">
                    {results.map(({ label, met }) => (
                        <li
                            key={label}
                            className={`flex items-center gap-2 text-sm leading-5 ${
                                met ? "text-success" : "text-danger-strong"
                            }`}
                        >
                            <Image
                                src={met ? iconRequirementMet : iconRequirementUnmet}
                                alt={met ? "Met:" : "Not met:"}
                            />
                            {label}
                        </li>
                    ))}
                </ul>

                <div className="flex flex-col gap-3 pt-[26px]">
                    <label htmlFor="confirm-password" className="text-sm leading-5 text-ink-strong">
                        Confirmation New Password<span className="text-danger-strong">*</span>
                    </label>
                    <PasswordInput
                        id="confirm-password"
                        autoComplete="new-password"
                        required
                        value={confirmation}
                        onChange={(e) => setConfirmation(e.target.value)}
                        placeholder="Re-type your new password"
                        aria-invalid={mismatch || undefined}
                        aria-describedby={mismatch ? "confirm-error" : undefined}
                        fieldClassName={`${fieldClass} h-[54px] ${
                            mismatch ? "border-danger-strong" : "border-field-soft"
                        }`}
                        className="text-sm text-ink-strong placeholder:text-[#abadb2]"
                        hiddenIcon={iconEye}
                        visibleIcon={iconEyeSlash}
                    />
                    {mismatch && (
                        <p
                            id="confirm-error"
                            role="alert"
                            className="flex items-center gap-[5px] text-xs leading-[18px] text-danger-strong"
                        >
                            <Image src={iconError} alt="" />
                            Passwords do not match
                        </p>
                    )}
                </div>

                <div className="pt-[34px]">
                    <Button type="submit" disabled={!canSubmit}>
                        Submit
                    </Button>
                </div>
            </form>
        </>
    );
}
