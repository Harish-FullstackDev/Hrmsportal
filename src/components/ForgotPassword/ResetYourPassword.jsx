"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Button, { ButtonLink } from "@/components/CommonComponents/Button";
import LogoMark from "@/components/CommonComponents/LogoMark";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Figma "Forgot password": heading, registered email field and two actions.
export default function ResetYourPassword() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const emailValid = EMAIL_PATTERN.test(email);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!emailValid) return;
        // TODO: send the reset code via Supabase before moving to the OTP step.
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    };

    return (
        <>
            <LogoMark />

            <div className="flex flex-col gap-4 pt-8 text-center">
                <h1 className="text-[32px] leading-10 font-semibold text-ink">Reset your password</h1>
                <p className="text-lg leading-[27px] text-[#202020]">
                    Enter your email address and we’ll send you password reset instructions.
                </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
                <div className="flex flex-col gap-3 pt-8">
                    <label htmlFor="email" className="text-sm leading-5 text-ink">
                        Registered Email<span className="text-[#ec4375]">*</span>
                    </label>
                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Input your registered email"
                        className="h-[54px] w-full rounded-[10px] border border-[#e8e8e8] bg-white px-[18px] text-sm text-ink outline-none placeholder:text-[#b2b7bf] focus:border-accent"
                    />
                </div>

                <div className="flex flex-col gap-4 pt-[34px]">
                    <Button type="submit" disabled={!emailValid}>
                        Send Reset Instructions
                    </Button>
                    <ButtonLink href="/" variant="outline">
                        Back To Login
                    </ButtonLink>
                </div>
            </form>
        </>
    );
}
