"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { signUpWithCode } from "@/lib/auth/codeActions";
import {
    AuthCard,
    Checkbox,
    FormMessage,
    PasswordField,
    SubmitButton,
    TextField,
    textClass,
} from "@/components/CommonComponents/AuthFormControls";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Figma 1306:2212 "Login and signup" (Sign Up): the create-account card.
// Creates the unconfirmed Supabase user (name in the user's metadata) on the
// server, which emails a 6-digit code; the user goes on to /verify-email.
export default function CreateYourAccount() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [agreed, setAgreed] = useState(false);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const edit = (setter) => (e) => {
        setter(e.target.value);
        setError(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (submitting) return;

        if (!EMAIL_PATTERN.test(email)) return setError("Enter a valid email address.");
        if (!firstName.trim() || !lastName.trim()) return setError("Enter your first and last name.");
        if (!password) return setError("Create a password.");
        if (!agreed) return setError("Please agree to the Terms of Use and Privacy Policy.");

        setSubmitting(true);
        setError(null);
        const result = await signUpWithCode({ email, password, firstName, lastName });
        setSubmitting(false);

        if (result.error) {
            setError(result.error);
            return;
        }

        router.push(`/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}`);
    };

    return (
        <AuthCard
            titleId="sign-up-title"
            title="Create Your Account"
            description="Create an account to explore opportunities and track your job applications."
        >
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
                <TextField
                    id="email"
                    label="Email Address"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={edit(setEmail)}
                    placeholder="yourname@email.com"
                />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <TextField
                        id="first-name"
                        label="First Name"
                        autoComplete="given-name"
                        value={firstName}
                        onChange={edit(setFirstName)}
                        placeholder="Enter Your First Name"
                    />
                    <TextField
                        id="last-name"
                        label="Last Name"
                        autoComplete="family-name"
                        value={lastName}
                        onChange={edit(setLastName)}
                        placeholder="Enter Your Last Name"
                    />
                </div>

                <PasswordField
                    id="password"
                    label="Password"
                    autoComplete="new-password"
                    value={password}
                    onChange={edit(setPassword)}
                    placeholder="Create a Strong Password"
                />

                <Checkbox
                    name="terms"
                    checked={agreed}
                    onChange={(e) => {
                        setAgreed(e.target.checked);
                        setError(null);
                    }}
                    boxClassName="rounded-[4px] border-neutral-300"
                >
                    I Agree to the Terms of Use and Privacy Policy
                </Checkbox>

                {error && <FormMessage>{error}</FormMessage>}

                <SubmitButton busy={submitting}>{submitting ? "Creating Account…" : "Create Account"}</SubmitButton>
            </form>

            <p className={textClass}>
                Already have an account?{" "}
                <Link
                    href="/"
                    className="text-action underline [text-underline-position:from-font] decoration-from-font hover:no-underline"
                >
                    Sign in
                </Link>
            </p>
        </AuthCard>
    );
}
