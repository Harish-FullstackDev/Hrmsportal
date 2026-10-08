import Image from "next/image";

import LegalFooter from "@/components/CommonComponents/LegalFooter";

// Single-column auth screen (forgot password, OTP, new password, success):
// a 480px content column over full-bleed contour artwork, footer pinned below.
// `contours` is the screen's static SVG import from src/assets/<Page>/.
export default function CenteredAuthLayout({
    contours,
    fontClassName = "font-manrope",
    footerClassName = "text-ink-strong",
    children,
}) {
    return (
        <div
            className={`relative isolate flex min-h-screen flex-1 flex-col overflow-hidden bg-white ${fontClassName}`}
        >
            <Image
                src={contours}
                alt=""
                aria-hidden
                fill
                priority
                className="pointer-events-none -z-10 object-cover"
            />

            <main className="flex flex-1 justify-center px-4 pt-[clamp(3rem,24vh,15.625rem)] pb-16 sm:px-6">
                <div className="w-full max-w-[480px]">{children}</div>
            </main>

            <div className="mx-auto w-full max-w-[480px] px-4 pb-[26px] sm:px-0">
                <LegalFooter className={`text-sm leading-5 ${footerClassName}`} />
            </div>
        </div>
    );
}
