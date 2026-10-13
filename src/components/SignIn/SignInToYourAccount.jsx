"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";
import PasswordInput from "@/components/CommonComponents/PasswordInput";

import iconEye from "@/assets/SignIn/icons/eye-16.svg";
import iconArrowRight from "@/assets/SignIn/icons/arrow-right-14.svg";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const textClass = "text-sm leading-[1.4]";
// Figma's field: 1 border + 13 padding around a 19.6 line (47.6 tall).
const fieldClass = "rounded-lg border bg-white p-[13px] transition-colors";

// Figma 1306:2612 "Login and signup": the sign-in card. Signs in with
// Supabase and goes to /dashboard.
export default function SignInToYourAccount() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (submitting) return;

        if (!EMAIL_PATTERN.test(email)) {
            setError("Enter a valid email address.");
            return;
        }
        if (!password) {
            setError("Enter your password.");
            return;
        }

        setSubmitting(true);
        setError(null);
        const supabase = createClient();
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        setSubmitting(false);

        if (signInError) {
            setError(
                signInError.code === "invalid_credentials"
                    ? "The email or password you entered is incorrect, please check again."
                    : signInError.message,
            );
            return;
        }

        router.push("/dashboard");
        router.refresh();
    };

    const borderClass = error ? "border-required" : "border-border-default";

    return (
        <section
            aria-labelledby="sign-in-title"
            className="flex w-full min-w-0 flex-col gap-6 overflow-hidden rounded-2xl border border-[rgba(229,231,235,0.8)] bg-white p-6 shadow-[4px_4px_12px_rgba(0,0,0,0.05)] backdrop-blur-[8px] sm:p-8 lg:w-[520px] lg:min-w-[380px] lg:shrink"
        >
            <h2 id="sign-in-title" className="text-sm leading-4 font-medium tracking-[0.05em] uppercase">
                Sign In to Your Account
            </h2>
            <p className={textClass}>
                Enter your credentials to access your careers portal and manage your job applications.
            </p>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className={textClass}>
                        Email Address <span className="text-required">*</span>
                    </label>
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
                        placeholder="yourname@email.com"
                        aria-invalid={error ? true : undefined}
                        aria-describedby={error ? "sign-in-error" : undefined}
                        className={`${fieldClass} ${borderClass} ${textClass} w-full outline-none placeholder:text-hint focus:border-action`}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className={textClass}>
                        Password <span className="text-required">*</span>
                    </label>
                    {/* The design has a single eye icon, so it is used for both states. */}
                    <PasswordInput
                        id="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError(null);
                        }}
                        placeholder="Create a Strong Password"
                        aria-invalid={error ? true : undefined}
                        aria-describedby={error ? "sign-in-error" : undefined}
                        fieldClassName={`${fieldClass} ${borderClass} gap-2`}
                        focusClassName="focus-within:border-action"
                        toggleClassName="size-4"
                        className={`${textClass} placeholder:text-hint`}
                        hiddenIcon={iconEye}
                        visibleIcon={iconEye}
                    />
                    {error && (
                        <p id="sign-in-error" role="alert" className={`${textClass} text-required`}>
                            {error}
                        </p>
                    )}
                </div>

                <div className={`flex items-center justify-between gap-4 ${textClass}`}>
                    <label className="flex cursor-pointer items-center gap-2 text-neutral-700">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                            className="peer sr-only"
                        />
                        <span className="grid size-4 place-items-center rounded-[3px] border border-border-default bg-white peer-checked:border-action peer-checked:bg-action peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-action">
                            {remember && (
                                <span className="mb-[2px] h-2 w-[5px] rotate-45 border-r-[1.5px] border-b-[1.5px] border-white" />
                            )}
                        </span>
                        Remember me
                    </label>
                    <Link href="/forgot-password" className="text-action hover:underline">
                        Forgot Password?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className={`flex w-full items-center justify-center gap-3 rounded-lg bg-action px-3 py-2.5 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] transition-colors hover:bg-action/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action disabled:cursor-wait disabled:opacity-70 ${textClass}`}
                >
                    {submitting ? "Signing In…" : "Sign In"}
                    <Image src={iconArrowRight} alt="" className="size-[14px]" />
                </button>
            </form>

            {/* TODO: /sign-up is the next screen to build. */}
            <p className={textClass}>
                Don&apos;t have an account?{" "}
                <Link
                    href="/sign-up"
                    className="text-action underline [text-underline-position:from-font] decoration-from-font hover:no-underline"
                >
                    Create an Account
                </Link>
            </p>
        </section>
    );
}
