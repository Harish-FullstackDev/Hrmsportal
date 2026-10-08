"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import Button from "@/components/CommonComponents/Button";
import LogoMark from "@/components/CommonComponents/LogoMark";

// Figma draws 4 boxes. Supabase email OTPs are 6 digits, so this must change
// before the step is wired to Supabase.
const CODE_LENGTH = 4;

// Figma "OTP Authentication". Reads the email from ?email=, so the page must
// wrap this in <Suspense>.
export default function OtpVerification() {
    const router = useRouter();
    const email = useSearchParams().get("email") ?? "your email";
    const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(""));
    const inputs = useRef([]);

    const complete = digits.every((d) => d !== "");

    const focus = (index) => {
        inputs.current[Math.max(0, Math.min(index, CODE_LENGTH - 1))]?.focus();
    };

    const setDigit = (index, value) => {
        const digit = value.replace(/\D/g, "").slice(-1);
        setDigits((prev) => prev.map((d, i) => (i === index ? digit : d)));
        if (digit) focus(index + 1);
    };

    const handleKeyDown = (index, event) => {
        if (event.key === "Backspace" && !digits[index]) focus(index - 1);
        if (event.key === "ArrowLeft") focus(index - 1);
        if (event.key === "ArrowRight") focus(index + 1);
    };

    const handlePaste = (event) => {
        const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
        if (!pasted) return;
        event.preventDefault();
        setDigits(Array.from({ length: CODE_LENGTH }, (_, i) => pasted[i] ?? ""));
        focus(pasted.length);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!complete) return;
        // TODO: verify the code with Supabase before moving to the reset step.
        router.push("/reset-password");
    };

    return (
        <>
            <LogoMark />

            <div className="flex flex-col gap-3 pt-[30px] text-center">
                <h1 className="text-[32px] leading-[44px] font-bold text-ink-strong">OTP Verification</h1>
                <p className="text-lg leading-[27px] text-[#24252a]">
                    We have sent a verification code to email address{" "}
                    <strong className="font-bold break-all">{email}.</strong>{" "}
                    <Link href="/forgot-password" className="text-accent hover:underline">
                        Wrong Email?
                    </Link>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8 pt-[33px]">
                <fieldset className="flex gap-[clamp(0.75rem,5vw,1.5rem)]">
                    <legend className="sr-only">One-time code</legend>
                    {digits.map((digit, i) => (
                        <input
                            key={i}
                            ref={(el) => {
                                inputs.current[i] = el;
                            }}
                            value={digit}
                            onChange={(e) => setDigit(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            onPaste={handlePaste}
                            onFocus={(e) => e.target.select()}
                            inputMode="numeric"
                            autoComplete={i === 0 ? "one-time-code" : "off"}
                            maxLength={1}
                            aria-label={`Digit ${i + 1}`}
                            className="h-14 w-full min-w-0 flex-1 rounded-[10px] border border-field-soft bg-white px-[18px] text-sm text-ink-strong caret-accent outline-none focus:border-accent"
                        />
                    ))}
                </fieldset>

                <Button type="submit" disabled={!complete} className="font-bold">
                    Submit
                </Button>
            </form>
        </>
    );
}
