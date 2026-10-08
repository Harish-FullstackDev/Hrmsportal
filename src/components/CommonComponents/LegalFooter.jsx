import Link from "next/link";

// Copyright + legal links shown at the bottom of every auth screen.
export default function LegalFooter({ className = "" }) {
    return (
        <footer
            className={`flex flex-wrap items-center gap-x-3 gap-y-1 sm:flex-nowrap sm:whitespace-nowrap ${className}`}
        >
            <p className="text-subtle">© 2025 HRDashboard. All rights reserved.</p>
            <Link href="/terms" className="hover:underline">
                Terms &amp; Conditions
            </Link>
            <Link href="/privacy" className="hover:underline">
                Privacy Policy
            </Link>
        </footer>
    );
}
