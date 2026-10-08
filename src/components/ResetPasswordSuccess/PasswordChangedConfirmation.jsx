import Image from "next/image";

import { ButtonLink } from "@/components/CommonComponents/Button";

import passwordChangedIllustration from "@/assets/ResetPasswordSuccess/password-changed-illustration.svg";

// Figma 57:3895 "Password changed confirmation".
export default function PasswordChangedConfirmation() {
    return (
        <div className="flex flex-col items-center gap-6">
            <Image src={passwordChangedIllustration} alt="" priority />

            <div className="flex flex-col gap-3.5 pt-[30px] text-center">
                <h1 className="text-[32px] leading-10 font-bold text-balance text-ink-strong">
                    You’ve successfully changed your password
                </h1>
                <p className="text-lg leading-[27px] text-[#24252a]">
                    Always remember the password for your account at HRDashboard!
                </p>
            </div>

            <ButtonLink href="/">Back to Login</ButtonLink>
        </div>
    );
}
