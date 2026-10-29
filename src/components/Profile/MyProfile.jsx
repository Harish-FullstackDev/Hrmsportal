"use client";

import Image from "next/image";

import mailIcon from "@/assets/Profile/icons/mail.svg";
import phoneIcon from "@/assets/Profile/icons/phone.svg";
import pinIcon from "@/assets/Profile/icons/pin.svg";
import shieldIcon from "@/assets/Profile/icons/shield.svg";
import portrait from "@/assets/Profile/portrait.jpg";
import MyApplications from "@/components/Jobs/MyApplications";

// TODO: replace with the candidate's profile once the backend serves it.
// Copy is Figma 1867:3464's sample data.
const PROFILE = {
    name: "Eleanor Vance",
    headline: ["Senior Product Designer & Systems Architect", "Platform Experience Tier"],
    email: "eleanor.vance@example.com",
    phone: "+1 (555) 234-8901",
    location: "San Francisco, CA, United States",
};

function PageHeading({ as: Heading = "h1", title, children }) {
    return (
        <div className="flex flex-col gap-1">
            <Heading className="text-[28px] leading-[1.2] font-medium capitalize text-ink sm:text-[32px]">{title}</Heading>
            <p className="text-base leading-[1.5] text-[#444651]">{children}</p>
        </div>
    );
}

function IconText({ icon, className = "gap-2", children }) {
    return (
        <span className={`flex items-center ${className}`}>
            <Image src={icon} alt="" aria-hidden className="shrink-0" />
            {children}
        </span>
    );
}

// Figma 1867:3590: portrait in the first two of 12 columns, the identity
// text from column 4.
function Identity() {
    return (
        <div className="flex flex-col gap-6 sm:flex-row sm:gap-12 lg:gap-[136px]">
            <div className="relative h-[208px] w-[176px] shrink-0 overflow-hidden rounded bg-[#e5eeff] shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
                <Image src={portrait} alt={PROFILE.name} fill sizes="176px" priority className="object-cover" />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-6 pt-1">
                <div className="flex flex-col gap-2">
                    <h2 className="pt-1 text-[28px] leading-[1.2] font-medium capitalize text-[#0b1c30] sm:text-[32px]">
                        {PROFILE.name}
                    </h2>
                    <p className="flex flex-wrap items-center gap-2 text-sm leading-[1.4] text-[#4d556b]">
                        {PROFILE.headline.map((part, index) => (
                            <span key={part} className="flex items-center gap-2">
                                {index > 0 && (
                                    <span aria-hidden className="text-xl leading-[27.5px] tracking-[-0.3px] text-[#c3c6d7]">
                                        /
                                    </span>
                                )}
                                {part}
                            </span>
                        ))}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-1 py-2 text-sm leading-[1.4] text-[#0b1c30]">
                        <IconText icon={mailIcon} className="gap-1">
                            <a href={`mailto:${PROFILE.email}`} className="hover:text-action">
                                {PROFILE.email}
                            </a>
                        </IconText>
                        <span aria-hidden className="text-[#c3c6d7]">
                            •
                        </span>
                        <IconText icon={phoneIcon}>{PROFILE.phone}</IconText>
                    </div>
                    <div className="py-2 text-sm leading-[1.4] text-[#0b1c30]">
                        <IconText icon={pinIcon}>{PROFILE.location}</IconText>
                    </div>
                </div>

                <p className="flex items-start gap-2 pt-6 text-[13px] leading-[18px] text-border-strong">
                    <Image src={shieldIcon} alt="" aria-hidden className="mt-0.5 shrink-0" />
                    Official verified talent dossier. Read-only record managed via Executive Talent Operations.
                    Direct adjustments require Partner delegation.
                </p>
            </div>
        </div>
    );
}

// Figma 1867:3464: the candidate's identity (sample data for now, see
// PROFILE), then their real applications from My Application. `jobs` is
// every open job, loaded on the server.
export default function MyProfile({ jobs }) {
    return (
        <div className="flex w-full flex-col px-4 pt-8 pb-16 sm:px-16">
            <section className="flex flex-col gap-[35px] pb-8">
                <PageHeading title="My Profile">
                    Manage your professional identity, career qualifications, and recruiter exposure.
                </PageHeading>
                <Identity />
            </section>

            <section className="flex flex-col gap-4 border-t border-border-default pt-6">
                <PageHeading as="h2" title="My Applications">
                    Review status, upcoming interviews, and progression stages across all active opportunities.
                </PageHeading>
                <MyApplications jobs={jobs} embedded />
            </section>
        </div>
    );
}
