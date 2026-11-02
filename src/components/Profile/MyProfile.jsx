"use client";

import Image from "next/image";

import mailIcon from "@/assets/Profile/icons/mail.svg";
import phoneIcon from "@/assets/Profile/icons/phone.svg";
import pinIcon from "@/assets/Profile/icons/pin.svg";
import shieldIcon from "@/assets/Profile/icons/shield.svg";
import portrait from "@/assets/Profile/portrait.jpg";

// TODO: replace with the candidate's profile once the backend serves it.
// Copy is Figma 2119:6361's sample data.
const PROFILE = {
    name: "Eleanor Vance",
    headline: "Senior Product Designer",
    email: "eleanor.vance@example.com",
    phone: "+1 (555) 234-8901",
    location: "San Francisco, CA, United States",
};

function PageHeading({ as: Heading, title, children }) {
    return (
        <div className="flex flex-col gap-1">
            <Heading className="text-[28px] leading-[1.2] font-medium capitalize text-ink sm:text-[32px]">{title}</Heading>
            <p className="text-base leading-[1.5] text-[#444651]">{children}</p>
        </div>
    );
}

// Icon gaps differ in Figma: 4 after the mail glyph, 8 after the others.
function ContactRow({ icon, gap = "gap-2", children }) {
    return (
        <li className={`flex items-center ${gap}`}>
            <Image src={icon} alt="" aria-hidden className="shrink-0" />
            {children}
        </li>
    );
}

// Figma "My Profile" side panel: heading, the centred identity block over a
// grey rule, the contact list, and the read-only notice pinned to the bottom.
function ProfilePanel() {
    return (
        <aside className="flex w-full flex-col justify-between gap-8 bg-surface-brand-subtle px-4 py-8 sm:px-6 xl:w-[432px] xl:shrink-0">
            <div className="flex flex-col gap-8">
                <PageHeading as="h1" title="My Profile">
                    Manage your professional identity, career qualifications, and recruiter exposure.
                </PageHeading>

                <div className="flex flex-col items-center gap-6 border-b border-border-default py-6 text-center">
                    <div className="relative size-40 overflow-hidden rounded-full bg-rail">
                        <Image src={portrait} alt={PROFILE.name} fill sizes="160px" priority className="object-cover" />
                    </div>
                    <div className="flex w-full flex-col gap-1">
                        <h2 className="text-2xl leading-[1.2] font-medium capitalize text-ink-heading">{PROFILE.name}</h2>
                        <p className="text-sm leading-[1.4] text-[#4d556b]">{PROFILE.headline}</p>
                    </div>
                </div>

                <ul className="flex flex-col gap-4 text-sm leading-[1.4] text-ink-heading">
                    <ContactRow icon={mailIcon} gap="gap-1">
                        <a href={`mailto:${PROFILE.email}`} className="break-all hover:text-action">
                            {PROFILE.email}
                        </a>
                    </ContactRow>
                    <ContactRow icon={phoneIcon}>
                        <a href={`tel:${PROFILE.phone.replace(/[^\d+]/g, "")}`} className="hover:text-action">
                            {PROFILE.phone}
                        </a>
                    </ContactRow>
                    <ContactRow icon={pinIcon}>{PROFILE.location}</ContactRow>
                </ul>
            </div>

            <p className="flex items-center gap-2 text-[13px] leading-[18px] text-border-strong">
                <Image src={shieldIcon} alt="" aria-hidden className="shrink-0" />
                Official verified talent dossier. Read-only record managed via Executive Talent Operations. Direct
                adjustments require Partner delegation.
            </p>
        </aside>
    );
}

// Figma 2119:6361: My Applications on the left (64 from the screen edge, 32
// top and bottom), the profile panel on the right running to the page bottom,
// 32 apart. Below xl the panel comes first, full width. `jobs` is every open
// job, loaded on the server.
export default function MyProfile({ jobs }) {
    return (
        <div className="flex w-full flex-1 flex-col xl:flex-row xl:gap-8 xl:pl-16">
            <section className="order-2 flex min-w-0 flex-1 flex-col gap-8 px-4 py-8 sm:px-16 xl:order-1 xl:px-0">
                <PageHeading as="h2" title="My Applications">
                    Review status, upcoming interviews, and progression stages across all active opportunities.
                </PageHeading>
                <div className="flex flex-col">
                    <MyApplications jobs={jobs} embedded />
                </div>
            </section>
            <div className="order-1 flex xl:order-2">
                <ProfilePanel />
            </div>
        </div>
    );
}
