"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";
import Button from "@/components/CommonComponents/Button";
import LegalFooter from "@/components/CommonComponents/LegalFooter";
import PasswordInput from "@/components/CommonComponents/PasswordInput";

import iconGoogle from "@/assets/Login/icons/google-22.svg";
import iconApple from "@/assets/Login/icons/apple-22.svg";
import iconEyeOff from "@/assets/Login/icons/eye-off-21.svg";
import iconValidEmail from "@/assets/Login/icons/valid-email-20.svg";
import iconCheckboxChecked from "@/assets/Login/icons/checkbox-checked-20.svg";
import iconEye from "@/assets/CommonComponents/icons/eye-20.svg";
import iconError from "@/assets/CommonComponents/icons/error-16.svg";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const labelClass = "text-[0.875rem] leading-[1.3125rem] font-medium tracking-[-0.0094rem] text-ink";
const fieldClass =
    "rounded-[0.5rem] border bg-white shadow-[0_2px_6px_rgba(17,24,39,0.03)] transition-colors";
const socialButtonClass =
    "flex h-[3.5625rem] items-center justify-center gap-[0.75rem] rounded-[0.5rem] border border-[#e0e3e3] bg-white text-[1rem] leading-[1.5rem] tracking-[-0.0195rem] text-[#191c22] shadow-[0_0.125rem_0.1875rem_rgba(17,24,39,0.03)] transition-colors hover:bg-zinc-50";

// Figma 57:4238: the sign-in panel. Signs in with Supabase and goes to
// /dashboard. The same component covers the empty, filled and error frames.
export default function LoginFirstToYourAccount() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const emailValid = EMAIL_PATTERN.test(email);
    const canSubmit = emailValid && password.length > 0 && !submitting;

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!canSubmit) return;

        setSubmitting(true);
        setError(null);
        const supabase = createClient();
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        setSubmitting(false);

        if (signInError) {
            setError(
                signInError.code === "invalid_credentials"
                    ? "The email or password you entered is incorrect, please check again"
                    : signInError.message,
            );
            return;
        }

        router.push("/dashboard");
        router.refresh();
    };

    return (
        <section className="flex min-h-0 flex-col items-center px-4 pt-16 pb-[1.5rem] sm:px-[3rem] lg:pt-0">
            {/* Desktop: the only parts that flex with screen height are Figma's
                empty space above the heading (112 padding + 80 spacer = 192)
                and the footer area below the form (189 gap + 18 footer = 207),
                kept in that ratio and squeezed no further than 48 / 40+18. */}
            <div aria-hidden className="hidden lg:block lg:min-h-[3rem] lg:flex-[192_1_0]" />

            <main className="w-full max-w-[30rem]">
                <h2 className="pt-px text-center text-[1.5rem] leading-[2.25rem] font-bold tracking-[-0.0206rem] text-ink">
                    Login first to your account
                </h2>

                <form onSubmit={handleSubmit} noValidate className="pt-[2.125rem]">
                    <label htmlFor="email" className={`block ${labelClass}`}>
                        Email Address <span className="text-danger">*</span>
                    </label>
                    <div className="relative mt-[0.6875rem]">
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError(null);
                            }}
                            placeholder="Input your registered email"
                            aria-invalid={error ? true : undefined}
                            aria-describedby={error ? "login-error" : undefined}
                            className={`${fieldClass} h-[3.625rem] w-full pr-[3.25rem] pl-[1.1875rem] text-[1rem] tracking-[-0.0194rem] text-ink outline-none placeholder:text-placeholder ${
                                error ? "border-danger" : "border-field focus:border-accent"
                            }`}
                        />
                        {emailValid && !error && (
                            <Image
                                src={iconValidEmail}
                                alt=""
                                className="pointer-events-none absolute top-1/2 right-[1.125rem] size-[1.25rem] -translate-y-1/2"
                            />
                        )}
                    </div>

                    {error && (
                        <p
                            id="login-error"
                            role="alert"
                            className="flex items-center gap-[0.3125rem] pt-[0.6875rem] text-[0.75rem] leading-[1.125rem] text-danger"
                        >
                            <Image src={iconError} alt="" className="size-[1rem]" />
                            {error}
                        </p>
                    )}

                    <label htmlFor="password" className={`block pt-[1.6875rem] ${labelClass}`}>
                        Password <span className="text-danger">*</span>
                    </label>
                    <PasswordInput
                        id="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Input your password account"
                        fieldClassName={`${fieldClass} mt-[0.6875rem] h-[3.625rem] border-field pr-[0.9375rem] pl-[1.1875rem]`}
                        className="text-[1rem] tracking-[-0.0194rem] text-ink placeholder:text-placeholder"
                        hiddenIcon={iconEyeOff}
                        visibleIcon={iconEye}
                    />

                    <div className="flex items-center justify-between gap-4 pt-[1.625rem] pb-[1.9375rem] text-[0.875rem] leading-[1.3125rem] tracking-[-0.0094rem] text-[#62676e]">
                        <label className="flex cursor-pointer items-center gap-[0.5625rem]">
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                className="peer sr-only"
                            />
                            <span className="grid size-[1.25rem] place-items-center rounded-[0.3125rem] border border-[#d8dcde] bg-white peer-checked:border-0 peer-focus-visible:outline-2 peer-focus-visible:outline-accent">
                                {remember && (
                                    <Image src={iconCheckboxChecked} alt="" className="size-[1.25rem]" />
                                )}
                            </span>
                            Remember Me
                        </label>
                        <Link href="/forgot-password" className="hover:text-ink">
                            Forgot Password
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        disabled={!canSubmit}
                        className="h-[3.5625rem] rounded-[0.5rem] text-[1rem] leading-[1.5rem]"
                    >
                        {submitting ? "Logging in…" : "Login"}
                    </Button>
                </form>

                <div className="flex items-center gap-[1.125rem] pt-[1.875rem] text-[0.8125rem] leading-[1.21875rem] tracking-[-0.0048rem] text-muted">
                    <span className="h-px w-[6.4125rem] shrink-0 bg-line" />
                    Or login with
                    <span className="h-px w-[6.4125rem] shrink-0 bg-line" />
                </div>

                <div className="grid grid-cols-2 gap-[1.0625rem] pt-[1.6875rem]">
                    <button type="button" className={socialButtonClass}>
                        <Image src={iconGoogle} alt="" className="size-[1.375rem]" />
                        Google
                    </button>
                    <button type="button" className={socialButtonClass}>
                        <Image src={iconApple} alt="" className="size-[1.375rem]" />
                        Apple
                    </button>
                </div>

                <p className="pt-[2.125rem] text-center text-[0.8125rem] leading-[1.21875rem] tracking-[-0.0048rem] text-[#afb3b7]">
                    You&apos;re new in here?{" "}
                    <Link href="/register" className="text-accent-strong hover:underline">
                        Create Account
                    </Link>
                </p>
            </main>

            <div className="flex flex-1 items-end pt-[2.5rem] lg:min-h-[3.625rem] lg:flex-[207_1_0] lg:pt-0">
                <LegalFooter className="justify-center gap-x-[0.8125rem] text-[0.75rem] leading-[1.125rem] text-[#202329]" />
            </div>
        </section>
    );
}
