import AuthSuccessCard from "@/components/CommonComponents/AuthSuccessCard";

// Shown after the sign-up email code is verified.
export default function EmailVerifiedSuccessfully() {
    return <AuthSuccessCard titleId="email-verified-title" title="Email Verified Successfully!" />;
}
