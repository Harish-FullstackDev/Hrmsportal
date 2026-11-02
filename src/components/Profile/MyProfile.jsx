"use client";

import Image from "next/image";

import mailIcon from "@/assets/Profile/icons/mail.svg";
import phoneIcon from "@/assets/Profile/icons/phone.svg";
import pinIcon from "@/assets/Profile/icons/pin.svg";
import shieldIcon from "@/assets/Profile/icons/shield.svg";
import { useProfile } from "@/components/Jobs/candidateStorage";

const initialsOf = (name) =>
    name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("");

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
// The name and email are the account's (`account`: { name, email }); the
// phone, location and latest role come from the candidate's last submitted
// application, kept in this browser (useProfile), and show once known. There
// is no photo upload yet, so the initials stand in for the portrait.
function ProfilePanel({ account }) {
    const details = useProfile() ?? {};
    const name = account.name || account.email;
    const headline = [details.jobTitle, details.employer].filter(Boolean).join(" · ") || "Candidate";

    return (
        <aside className="flex w-full flex-col justify-between gap-8 bg-surface-brand-subtle px-4 py-8 sm:px-6 xl:w-[432px] xl:shrink-0 xl:overflow-y-auto">
            <div className="flex flex-col gap-8">
                <PageHeading as="h1" title="My Profile">
                    Manage your professional identity, career qualifications, and recruiter exposure.
                </PageHeading>

                <div className="flex flex-col items-center gap-6 border-b border-border-default py-6 text-center">
                    <div
                        aria-hidden="true"
                        className="flex size-40 items-center justify-center rounded-full bg-rail text-5xl leading-none font-medium text-action"
                    >
                        {initialsOf(name)}
                    </div>
                    <div className="flex w-full flex-col gap-1">
                        <h2 className="text-2xl leading-[1.2] font-medium capitalize text-ink-heading">{name}</h2>
                        <p className="text-sm leading-[1.4] text-[#4d556b]">{headline}</p>
                    </div>
                </div>

                <ul className="flex flex-col gap-4 text-sm leading-[1.4] text-ink-heading">
                    <ContactRow icon={mailIcon} gap="gap-1">
                        <a href={`mailto:${account.email}`} className="break-all hover:text-action">
                            {account.email}
                        </a>
                    </ContactRow>
                    {details.phone && (
                        <ContactRow icon={phoneIcon}>
                            <a href={`tel:${details.phone.replace(/[^\d+]/g, "")}`} className="hover:text-action">
                                {details.phone}
                            </a>
                        </ContactRow>
                    )}
                    {details.location && <ContactRow icon={pinIcon}>{details.location}</ContactRow>}
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
// 32 apart. On xl the page fits the window (JobsShell `fit`): the heading
// stays, and the applications and the panel each scroll on their own. Below
// xl the panel comes first, full width, and the window scrolls as usual. `account` is the
// signed-in user ({ name, email }); `applications` is the <MyApplications>
// list (or its loading placeholder), rendered on the server.
export default function MyProfile({ account, applications }) {
    return (
        <div className="flex w-full flex-1 flex-col xl:min-h-0 xl:flex-row xl:gap-8 xl:pl-16">
            <section className="order-2 flex min-w-0 flex-1 flex-col gap-8 px-4 py-8 sm:px-16 xl:order-1 xl:min-h-0 xl:px-0 xl:pb-0">
                <PageHeading as="h2" title="My Applications">
                    Review status, upcoming interviews, and progression stages across all active opportunities.
                </PageHeading>
                <div className="flex flex-col xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:pr-2 xl:pb-8">{applications}</div>
            </section>
            <div className="order-1 flex xl:order-2 xl:min-h-0">
                <ProfilePanel account={account} />
            </div>
        </div>
    );
}
