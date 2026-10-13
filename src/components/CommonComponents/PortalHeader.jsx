import Image from "next/image";
import Link from "next/link";

import ascendusLogo from "@/assets/CommonComponents/ascendus-logo-primary.svg";

// Figma 1306:2571: top bar of the careers-portal screens. Links and logo sit
// 64 in from the screen edges at every desktop width; the border runs edge
// to edge.
export default function PortalHeader() {
    return (
        <header className="relative w-full border-b border-primary-200">
            <div className="flex w-full items-center justify-between gap-4 px-4 pt-6 pb-4 sm:px-16 lg:pt-8 lg:pb-6">
                {/* TODO: point these at the real pages once they exist. */}
                <nav className="flex items-center gap-4 text-sm whitespace-nowrap leading-[1.5] capitalize sm:gap-8 sm:text-base">
                    <Link href="#" className="hover:text-action">
                        Search Jobs
                    </Link>
                    <Link href="#" className="hover:text-action">
                        My Application
                    </Link>
                </nav>
                <Link href="/" className="shrink-0">
                    <Image
                        src={ascendusLogo}
                        alt="Ascendus Company"
                        priority
                        className="h-6 w-auto sm:h-8"
                    />
                </Link>
            </div>
        </header>
    );
}
