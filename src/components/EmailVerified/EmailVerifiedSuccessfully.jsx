import Image from "next/image";
import Link from "next/link";

import { AuthCardShell, CardTitle } from "@/components/CommonComponents/AuthFormControls";

import iconVerified from "@/assets/EmailVerified/verified-check-32.svg";
import iconArrowRight from "@/assets/CommonComponents/icons/arrow-right-blue-14.svg";

// Figma 1306:2505 "Login and signup" (verified mail): the success card after
// the email code is verified. 1 border + 32 / 48 padding = Figma's 33 / 49;
// icon, title and link centred, 16 apart (202 tall).
export default function EmailVerifiedSuccessfully() {
    return (
        <AuthCardShell aria-labelledby="email-verified-title" className="items-center gap-4 px-8 py-12">
            <Image src={iconVerified} alt="" className="size-8" />
            <CardTitle id="email-verified-title" className="text-center">
                Email Verified Successfully!
            </CardTitle>
            <Link
                href="/"
                className="group flex items-center gap-1 text-base leading-6 text-action capitalize"
            >
                <span className="underline [text-underline-position:from-font] decoration-from-font group-hover:no-underline">
                    Sign in
                </span>
                <Image src={iconArrowRight} alt="" className="size-[14px]" />
            </Link>
        </AuthCardShell>
    );
}
